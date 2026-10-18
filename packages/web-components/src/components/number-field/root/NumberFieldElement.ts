import { NumberFieldMachine } from '@flippo-software/core-components/number-field';
import { effect, untracked } from '@flippo-software/store';

import type {
    NumberFieldChangeEventDetails,
    NumberFieldCommitEventDetails,
    NumberFieldOptions
} from '@flippo-software/core-components/number-field';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { property } from '../../../lib/MachineElement';
import { ControlElement } from '../../field/utils/ControlElement';

import { NumberFieldContext, type NumberFieldValueChangeDetail, type NumberFieldValueCommittedDetail } from './NumberFieldRootContext';

/**
 * A text input for numbers, with buttons to step the value, the arrow keys, the wheel and scrubbing: the root of the
 * `-number-field-*` parts. It takes part in forms: it submits its value under `name`.
 *
 * Attributes: `value` (controlled; `""` for no value), `default-value`, `min`, `max`, `step` (1), `small-step` (0.1,
 * with Alt), `large-step` (10, with Shift), `name`, `disabled`, `read-only`, `required`, `allow-wheel-scrub`,
 * `snap-on-step`, `locale`.
 * Properties: `format` (`Intl.NumberFormatOptions`).
 * Events: `value-change` (cancelable; `detail: { value, reason }`), `value-committed` (`detail: { value, reason }`).
 * State attributes: `data-disabled`, `data-readonly`, `data-required`, `data-scrubbing`, and those of the field.
 */
export class NumberFieldElement extends ControlElement.withAttributes({
    /** The raw numeric value of the field. */
    value: 'string',
    /**
     * The uncontrolled value of the field when it’s initially rendered.
     *
     * To render a controlled number field, use the `value` attribute instead.
     */
    'default-value': 'number',
    /** The minimum value of the input element. */
    min: 'number',
    /** The maximum value of the input element. */
    max: 'number',
    /**
     * Amount to increment and decrement with the buttons and arrow keys,
     * or to scrub with pointer movement in the scrub area.
     * @default 1
     */
    step: 'number',
    /**
     * The small step value of the input element when incrementing while the meta key is held. Snaps
     * to multiples of this value.
     * @default 0.1
     */
    'small-step': 'number',
    /**
     * The large step value of the input element when incrementing while the shift key is held. Snaps
     * to multiples of this value.
     * @default 10
     */
    'large-step': 'number',
    /** Identifies the field when a form is submitted. */
    name: 'string',
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled: 'boolean',
    /**
     * Whether the user should be unable to change the field value.
     * @default false
     */
    'read-only': 'boolean',
    /**
     * Whether the user must enter a value before submitting a form.
     * @default false
     */
    required: 'boolean',
    /**
     * Whether to allow the user to scrub the input value with the mouse wheel while focused and
     * hovering over the input.
     * @default false
     */
    'allow-wheel-scrub': 'boolean',
    /**
     * Whether the value should snap to the nearest step when incrementing or decrementing.
     * @default false
     */
    'snap-on-step': 'boolean',
    /**
     * The locale of the input element.
     * Defaults to the user's runtime locale.
     */
    locale: 'string',
    /** Options to format the input value. */
    format: property<Intl.NumberFormatOptions>()
}) {
    private numberField!: NumberFieldMachine;

    private readonly generatedId = createId('number-field');

    constructor() {
        super();
        declareProvider(this, NumberFieldContext);
    }

    get machine(): NumberFieldMachine {
        return this.numberField;
    }

    protected override createParts() {
        this.numberField = new NumberFieldMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.numberField.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.numberField.afterCommit();
    }

    protected override connectParts() {
        const { numberField, formControl } = this;
        const disconnect = numberField.connect();
        const stopProviding = provideContext(this, NumberFieldContext, this);
        const unregisterId = numberField.registerId();
        // Registered again when the value changes: the registration holds it.
        const stopRegistering = effect(() => {
            numberField.value;
            numberField.name;
            return untracked(() => numberField.registerField());
        });
        const stopSyncing = effect(() => {
            const { name, value } = numberField;
            const formValue = this.toFormValue(name, value === null ? '' : String(value));
            untracked(() => formControl.sync(formValue, numberField.inputRef.current));
        });
        return () => {
            stopSyncing();
            stopRegistering();
            unregisterId();
            stopProviding();
            disconnect();
        };
    }

    protected override getProps(): Props {
        return NumberFieldMachine.attrs(this.numberField.getState());
    }

    protected override resetValue() {
        if (this.value === undefined) {
            this.numberField.setInputValue(this.defaultValue === undefined ? '' : String(this.defaultValue));
            this.numberField.store.set('value', this.defaultValue ?? null);
        }
    }

    private getOptions(): NumberFieldOptions {
        const { value } = this;
        return {
            value: value === undefined ? undefined : value === '' ? null : Number(value),
            defaultValue: this.defaultValue,
            min: this.min,
            max: this.max,
            step: this.step,
            smallStep: this.smallStep,
            largeStep: this.largeStep,
            name: this.name,
            disabled: (this.disabled ?? false) || this.formDisabled,
            readOnly: this.readOnly ?? false,
            required: this.required ?? false,
            allowWheelScrub: this.allowWheelScrub ?? false,
            snapOnStep: this.snapOnStep ?? false,
            locale: this.locale,
            format: this.format,
            field: this.field?.machine ?? null,
            labelable: this.labelable,
            defaultId: this.generatedId,
            onValueChange: (next: number | null, eventDetails: NumberFieldChangeEventDetails) => {
                this.emit(
                    'value-change',
                    { value: next, reason: eventDetails.reason } satisfies NumberFieldValueChangeDetail,
                    eventDetails
                );
            },
            onValueCommitted: (next: number | null, eventDetails: NumberFieldCommitEventDetails) => {
                this.emit('value-committed', { value: next, reason: eventDetails.reason } satisfies NumberFieldValueCommittedDetail);
            }
        };
    }
}
