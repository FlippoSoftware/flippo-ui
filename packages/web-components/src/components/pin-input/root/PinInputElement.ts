import { PinInputMachine } from '@flippo-software/core-components/pin-input';
import { mergeProps } from '@flippo-software/core-components/props';
import { effect, untracked } from '@flippo-software/store';

import type { PinInputOptions } from '@flippo-software/core-components/pin-input';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { ControlElement } from '../../field/utils/ControlElement';

import { PinInputContext, type PinInputValueChangeDetail } from './PinInputRootContext';

/**
 * A code typed one character per input (a one-time password, a PIN): the root of the `-pin-input-*` parts. It takes
 * part in forms: it submits the whole code under `name`.
 *
 * Attributes: `value` (controlled), `default-value`, `name`, `disabled`, `read-only`, `required`, `placeholder`
 * (`○`), `type` (`numeric` by default, `alphabetic`, `alphanumeric`), `pattern`, `otp` (autocomplete of one-time
 * codes), `mask` (hides the characters), `blur-on-complete`, `select-on-focus`.
 * Events: `value-change` (`detail: { value, values }`), `value-complete` (`detail: { value, values }`).
 * State attributes: `data-disabled`, `data-readonly`, `data-complete`, and those of the field.
 */
export class PinInputElement extends ControlElement.withAttributes({
    /**
     * The controlled value of the pin input: the characters entered.
     *
     * To render an uncontrolled pin input, use the `default-value` attribute instead.
     */
    value: 'string',
    /**
     * The initial value of an uncontrolled pin input.
     *
     * To render a controlled pin input, use the `value` attribute instead.
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
     * Whether the user should be unable to select a different radio button in the group.
     * @default false
     */
    'read-only': 'boolean',
    /**
     * Whether the user must choose a value before submitting a form.
     * @default false
     */
    required: 'boolean',
    /**
     * The placeholder text for the input
     * @default "○"
     */
    placeholder: 'string',
    /** The type of input to render */
    type: ['numeric', 'alphabetic', 'alphanumeric'],
    /** The regular expression that the user-entered input value is checked against. */
    pattern: 'string',
    /**
     * Whether the input takes one-time codes: `autocomplete="one-time-code"`, so the browser can fill the code it received.
     * @default false
     */
    otp: 'boolean',
    /**
     * Whether to hide the entered characters, like a password input.
     * @default false
     */
    mask: 'boolean',
    /** Whether to blur the input when the value is complete */
    'blur-on-complete': 'boolean',
    /** Whether to select input value when input is focused */
    'select-on-focus': 'boolean'
}) {
    private pinInput!: PinInputMachine;

    private readonly generatedId = createId('pin-input');

    constructor() {
        super();
        declareProvider(this, PinInputContext);
    }

    get machine(): PinInputMachine {
        return this.pinInput;
    }

    protected override createParts() {
        this.pinInput = new PinInputMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.pinInput.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.pinInput.afterCommit();
    }

    protected override connectParts() {
        const { pinInput, formControl } = this;
        const disconnect = pinInput.connect();
        pinInput.setInputElement(formControl.input);
        const stopProviding = provideContext(this, PinInputContext, this);
        // Registered again when the value changes: the registration holds it.
        const stopRegistering = effect(() => {
            pinInput.checkedValue;
            pinInput.name;
            return untracked(() => pinInput.registerField());
        });
        const stopSyncing = effect(() => {
            const inputProps = pinInput.getInputProps();
            const value = pinInput.checkedValue ?? '';
            const formValue = this.toFormValue(pinInput.name, value || null);
            untracked(() => {
                formControl.applyInput(inputProps);
                formControl.sync(formValue, pinInput.elementsRef.current[0] ?? this.target);
            });
        });
        return () => {
            stopSyncing();
            stopRegistering();
            stopProviding();
            pinInput.setInputElement(null);
            disconnect();
        };
    }

    protected override getProps(): Props {
        return mergeProps(this.pinInput.getRootProps(), PinInputMachine.attrs(this.pinInput.getState()));
    }

    protected override resetValue() {
        if (this.value === undefined) {
            const value = this.defaultValue ?? '';
            this.pinInput.store.update({ checkedValue: value, values: value.split('') });
        }
    }

    private getOptions(): PinInputOptions {
        return {
            value: this.value,
            defaultValue: this.defaultValue,
            name: this.name,
            disabled: (this.disabled ?? false) || this.formDisabled,
            readOnly: this.readOnly ?? false,
            required: this.required ?? false,
            placeholder: this.placeholder ?? '○',
            type: this.type ?? 'numeric',
            pattern: this.pattern,
            otp: this.otp ?? false,
            mask: this.mask ?? false,
            blurOnComplete: this.blurOnComplete ?? false,
            selectOnFocus: this.selectOnFocus ?? false,
            field: this.field?.machine ?? null,
            labelable: this.labelable,
            id: this.targetId(this.generatedId),
            direction: this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr',
            onValueChange: (value: string, values: string[]) => {
                this.emit('value-change', { value, values } satisfies PinInputValueChangeDetail);
            },
            onValueComplete: (value: string, values: string[]) => {
                this.emit('value-complete', { value, values } satisfies PinInputValueChangeDetail);
            }
        };
    }
}
