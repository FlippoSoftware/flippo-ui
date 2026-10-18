import { mergeProps } from '@flippo-software/core-components/props';
import { RadioCardMachine } from '@flippo-software/core-components/radio-card';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';
import type { RadioCardOptions } from '@flippo-software/core-components/radio-card';

import { declareProvider, provideContext, requestAncestorContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { ControlElement } from '../../field/utils/ControlElement';
import { RadioGroupContext } from '../../radio/root/RadioRootContext';
import { RadioGroupElement } from '../../radio-group/root/RadioGroupElement';

import { RadioCardContext } from './RadioCardRootContext';

/**
 * A card of a radio group: a radio with rich content.
 *
 * Attributes: `value` (required), `disabled`, `read-only`, `required`.
 * State attributes: `data-checked` / `data-unchecked`, `data-disabled`, `data-readonly`, `data-required`, and those
 * of the field.
 */
export class RadioCardElement extends ControlElement.withAttributes({
    /** The unique identifying value of this card in the group. */
    value: 'string',
    /** Whether the component should ignore user interaction. */
    disabled: 'boolean',
    /** Whether the user should be unable to change the selection. */
    'read-only': 'boolean',
    /** Whether the user must choose a value before submitting a form. */
    required: 'boolean'
}) {
    private radio!: RadioCardMachine;

    private group: RadioGroupElement | undefined;

    private readonly generatedId = createId('radio-card');

    constructor() {
        // The group takes part in forms, not its radios.
        super(false);
        declareProvider(this, RadioCardContext);
    }

    get machine(): RadioCardMachine {
        return this.radio;
    }

    protected override requestControlContexts(callback: () => void) {
        return requestAncestorContext(this, RadioGroupContext, RadioGroupElement, (group) => {
            this.group = group;
            callback();
        });
    }

    protected override createParts() {
        this.radio = new RadioCardMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.radio.setOptions(this.getOptions());
    }

    protected override connectParts() {
        const { radio, formControl } = this;
        const disconnect = radio.connect();
        radio.setInputElement(formControl.input);
        const stopProviding = provideContext(this, RadioCardContext, this);
        const unregisterId = radio.registerId();
        const stopSyncing = effect(() => {
            const inputProps = radio.getInputProps();
            untracked(() => formControl.applyInput(inputProps));
        });
        return () => {
            stopSyncing();
            unregisterId();
            stopProviding();
            radio.setInputElement(null);
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.radio?.setRadioElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.radio.getRootProps(), RadioCardMachine.attrs(this.radio.getState()));
    }

    protected override resetValue() {}

    private getOptions(): RadioCardOptions {
        const id = this.targetId(this.generatedId);
        return {
            value: this.value ?? '',
            defaultId: id,
            disabled: this.disabled,
            readOnly: this.readOnly,
            required: this.required,
            group: this.group?.machine ?? null,
            field: this.field?.machine ?? null,
            fieldItemDisabled: this.fieldItem?.itemDisabled ?? false,
            labelable: this.labelable
        };
    }
}
