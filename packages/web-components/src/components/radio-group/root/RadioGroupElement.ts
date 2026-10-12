import { mergeProps } from '@flippo-software/core-components/props';
import { RadioGroupMachine } from '@flippo-software/core-components/radio-group';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';
import type { RadioGroupChangeEventDetails, RadioGroupOptions } from '@flippo-software/core-components/radio-group';

import { declareProvider, provideContext, requestAncestorContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { ControlElement } from '../../field/utils/ControlElement';
import { FieldsetElement } from '../../fieldset/root/FieldsetElement';
import { FieldsetContext } from '../../fieldset/root/FieldsetRootContext';
import { RadioGroupContext, type RadioGroupValueChangeDetail } from '../../radio/root/RadioRootContext';

/**
 * Radios of which one is checked; the arrow keys move between them. It takes part in forms: it submits the value of
 * the checked radio under `name`.
 *
 * Attributes: `value` (controlled), `default-value`, `name`, `disabled`, `read-only`, `required`.
 * Events: `value-change` (cancelable; `detail: { value, reason }`).
 * State attributes: `data-disabled`, `data-readonly`, `data-required`, and those of the field.
 */
export class RadioGroupElement extends ControlElement.withAttributes({
    value: 'string',
    'default-value': 'string',
    name: 'string',
    disabled: 'boolean',
    'read-only': 'boolean',
    required: 'boolean'
}) {
    private group!: RadioGroupMachine;

    private fieldset: FieldsetElement | undefined;

    private readonly generatedId = createId('radio-group');

    constructor() {
        super();
        declareProvider(this, RadioGroupContext);
    }

    get machine(): RadioGroupMachine {
        return this.group;
    }

    protected override requestControlContexts(callback: () => void) {
        return requestAncestorContext(this, FieldsetContext, FieldsetElement, (fieldset) => {
            this.fieldset = fieldset;
            callback();
        });
    }

    protected override createParts() {
        this.group = new RadioGroupMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.group.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.group.afterCommit();
    }

    protected override connectParts() {
        const { group, formControl } = this;
        const disconnect = group.connect();
        group.setInputElement(formControl.input);
        const stopProviding = provideContext(this, RadioGroupContext, this);
        // Registered again when the value changes: the registration holds it.
        const stopRegistering = effect(() => {
            group.checkedValue;
            group.name;
            return untracked(() => group.registerField());
        });
        const stopSyncing = effect(() => {
            const inputProps = group.getInputProps();
            const checked = group.checkedValue;
            const formValue = this.toFormValue(group.name, checked == null ? null : String(group.serializedCheckedValue));
            untracked(() => {
                formControl.applyInput(inputProps);
                formControl.sync(formValue, this.target);
            });
        });
        return () => {
            stopSyncing();
            stopRegistering();
            stopProviding();
            group.setInputElement(null);
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.group?.composite.setRoot(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.group.getRootProps(), RadioGroupMachine.attrs(this.group.getState()));
    }

    protected override resetValue() {
        if (this.value === undefined) {
            this.group.store.set('checkedValue', this.defaultValue);
        }
    }

    private getOptions(): RadioGroupOptions {
        return {
            value: this.value,
            defaultValue: this.defaultValue,
            name: this.name,
            disabled: (this.disabled ?? false) || this.formDisabled,
            readOnly: this.readOnly ?? false,
            required: this.required ?? false,
            field: this.field?.machine ?? null,
            fieldset: this.fieldset?.machine ?? null,
            labelable: this.labelable,
            id: this.targetId(this.generatedId),
            direction: this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr',
            onValueChange: (value: unknown, eventDetails: RadioGroupChangeEventDetails) => {
                this.emit(
                    'value-change',
                    { value: value as string, reason: eventDetails.reason } satisfies RadioGroupValueChangeDetail,
                    eventDetails
                );
            }
        };
    }
}
