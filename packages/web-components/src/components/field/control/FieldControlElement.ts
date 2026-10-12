import { createDetachedField, FieldControlMachine, FieldRootMachine } from '@flippo-software/core-components/field';
import { mergeProps } from '@flippo-software/core-components/props';
import { effect, untracked } from '@flippo-software/store';

import type { FieldControlChangeEventDetails } from '@flippo-software/core-components/field';
import type { Props } from '@flippo-software/core-components/props';

import { createId } from '../../../lib/createId';
import { FieldPart, type FieldValueChangeDetail } from '../root/FieldRootContext';

/**
 * The text control of the field: put it on an `<input>` or a `<textarea>` with `as-child`.
 *
 * Attributes: `name` (or the field's), `value` (controlled), `default-value`, `disabled`.
 * Events: `value-change` (cancelable; `detail: { value, reason }`).
 */
export class FieldControlElement extends FieldPart.withAttributes({
    name: 'string',
    value: 'string',
    'default-value': 'string',
    disabled: 'boolean'
}) {
    private control!: FieldControlMachine;

    private readonly generatedId = createId('field-control');

    private readonly detachedField = createDetachedField();

    private get fieldMachine(): FieldRootMachine {
        return this.field?.machine ?? this.detachedField;
    }

    protected override createParts() {
        this.control = new FieldControlMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.control.setOptions(this.getOptions());
    }

    protected override connectParts() {
        const unregisterId = this.control.registerId();
        // Registered again when the value changes: the registration holds it.
        const stopRegistering = effect(() => {
            this.control.value;
            this.control.name;
            this.control.id;
            this.fieldMachine.validityData;
            return untracked(() => this.control.registerField());
        });
        this.control.syncFilled();
        return () => {
            stopRegistering();
            unregisterId();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.fieldMachine.inputRef.current = element as HTMLInputElement | null;
    }

    protected override getProps(): Props {
        return mergeProps(this.control.getControlProps(), FieldRootMachine.attrs(this.control.getState()));
    }

    private getOptions() {
        const pageId = this.targetId('');
        return {
            id: pageId || undefined,
            name: this.name,
            value: this.value,
            defaultValue: this.defaultValue,
            disabled: this.disabled ?? false,
            field: this.fieldMachine,
            labelable: this.labelable ?? null,
            defaultId: this.generatedId,
            onValueChange: (value: string, eventDetails: FieldControlChangeEventDetails) => {
                this.emit('value-change', { value, reason: eventDetails.reason } satisfies FieldValueChangeDetail, eventDetails);
            }
        };
    }
}
