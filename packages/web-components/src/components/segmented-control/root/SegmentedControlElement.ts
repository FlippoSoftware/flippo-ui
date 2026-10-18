import { mergeProps } from '@flippo-software/core-components/props';
import { SegmentedControlMachine } from '@flippo-software/core-components/segmented-control';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';
import type { SegmentedControlChangeEventDetails, SegmentedControlOptions } from '@flippo-software/core-components/segmented-control';

import { declareProvider, provideContext, requestAncestorContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { ControlElement } from '../../field/utils/ControlElement';
import { FieldsetElement } from '../../fieldset/root/FieldsetElement';
import { FieldsetContext } from '../../fieldset/root/FieldsetRootContext';

import { SegmentedControlContext, type SegmentedControlValueChangeDetail } from './SegmentedControlRootContext';

/**
 * Buttons of which one is selected, like a radio group drawn as a row of buttons. It takes part in forms: it submits
 * the selected value under `name`.
 *
 * Attributes: `value` (controlled), `default-value`, `name`, `disabled`, `read-only`, `required`, `orientation`
 * (`horizontal` by default, `vertical`), `loop-focus` (`"false"` stops the arrow keys at the ends).
 * Events: `value-change` (cancelable; `detail: { value, reason }`).
 * State attributes: `data-disabled`, `data-readonly`, `data-orientation`, and those of the field.
 */
export class SegmentedControlElement extends ControlElement.withAttributes({
    /**
     * The controlled selected value.
     * Uncontrolled counterpart: `default-value`.
     */
    value: 'string',
    /**
     * The initially selected value (uncontrolled).
     * @default null
     */
    'default-value': 'string',
    /** Identifies the field when a form is submitted. */
    name: 'string',
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled: 'boolean',
    /**
     * Whether the selected value can be changed.
     * @default false
     */
    'read-only': 'boolean',
    /**
     * Whether the user must select a value before submitting a form.
     * @default false
     */
    required: 'boolean',
    /**
     * The orientation of the component — controls arrow-key navigation direction.
     * @default 'horizontal'
     */
    orientation: ['horizontal', 'vertical'],
    /**
     * Whether keyboard focus loops back to the first item after the last.
     * @default true
     */
    'loop-focus': 'boolean'
}) {
    private control!: SegmentedControlMachine;

    private fieldset: FieldsetElement | undefined;

    private readonly generatedId = createId('segmented-control');

    constructor() {
        super();
        declareProvider(this, SegmentedControlContext);
    }

    get machine(): SegmentedControlMachine {
        return this.control;
    }

    protected override requestControlContexts(callback: () => void) {
        return requestAncestorContext(this, FieldsetContext, FieldsetElement, (fieldset) => {
            this.fieldset = fieldset;
            callback();
        });
    }

    protected override createParts() {
        this.control = new SegmentedControlMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.control.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.control.afterCommit();
    }

    protected override connectParts() {
        const { control, formControl } = this;
        const disconnect = control.connect();
        control.setInputElement(formControl.input);
        const stopProviding = provideContext(this, SegmentedControlContext, this);
        // Registered again when the value changes: the registration holds it.
        const stopRegistering = effect(() => {
            control.value;
            control.name;
            return untracked(() => control.registerField());
        });
        const stopSyncing = effect(() => {
            const inputProps = control.getInputProps();
            const formValue = this.toFormValue(control.name, control.value);
            untracked(() => {
                formControl.applyInput(inputProps);
                formControl.sync(formValue, this.target);
            });
        });
        return () => {
            stopSyncing();
            stopRegistering();
            stopProviding();
            control.setInputElement(null);
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.control?.setRootElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.control.getRootProps(), SegmentedControlMachine.attrs(this.control.getState()));
    }

    protected override resetValue() {
        if (this.value === undefined) {
            this.control.store.set('value', this.defaultValue ?? null);
        }
    }

    private getOptions(): SegmentedControlOptions {
        return {
            value: this.value,
            defaultValue: this.defaultValue ?? null,
            name: this.name,
            disabled: (this.disabled ?? false) || this.formDisabled,
            readOnly: this.readOnly ?? false,
            required: this.required ?? false,
            orientation: this.orientation ?? 'horizontal',
            loopFocus: this.loopFocus ?? true,
            field: this.field?.machine ?? null,
            fieldset: this.fieldset?.machine ?? null,
            labelable: this.labelable,
            id: this.targetId(this.generatedId),
            direction: this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr',
            onValueChange: (value: string, eventDetails: SegmentedControlChangeEventDetails) => {
                this.emit('value-change', { value, reason: eventDetails.reason } satisfies SegmentedControlValueChangeDetail, eventDetails);
            }
        };
    }
}
