import { mergeProps } from '@flippo-software/core-components/props';
import { RadioMachine } from '@flippo-software/core-components/radio';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';
import type { RadioOptions } from '@flippo-software/core-components/radio';

import { declareProvider, provideContext, requestAncestorContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { ControlElement } from '../../field/utils/ControlElement';
import { RadioGroupElement } from '../../radio-group/root/RadioGroupElement';

import { RadioContext, RadioGroupContext } from './RadioRootContext';

/**
 * A radio of a radio group.
 *
 * Attributes: `value` (required), `disabled`, `read-only`, `required`.
 * State attributes: `data-checked` / `data-unchecked`, `data-disabled`, `data-readonly`, `data-required`, and those
 * of the field.
 */
export class RadioElement extends ControlElement.withAttributes({
    value: 'string',
    disabled: 'boolean',
    'read-only': 'boolean',
    required: 'boolean'
}) {
    private radio!: RadioMachine;

    private group: RadioGroupElement | undefined;

    private readonly generatedId = createId('radio');

    constructor() {
        // The group takes part in forms, not its radios.
        super(false);
        declareProvider(this, RadioContext);
    }

    get machine(): RadioMachine {
        return this.radio;
    }

    protected override requestControlContexts(callback: () => void) {
        return requestAncestorContext(this, RadioGroupContext, RadioGroupElement, (group) => {
            this.group = group;
            callback();
        });
    }

    protected override createParts() {
        this.radio = new RadioMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.radio.setOptions(this.getOptions());
    }

    protected override connectParts() {
        const { radio, formControl } = this;
        const disconnect = radio.connect();
        radio.setInputElement(formControl.input);
        const stopProviding = provideContext(this, RadioContext, this);
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
        return mergeProps(this.radio.getRootProps(), RadioMachine.attrs(this.radio.getState()));
    }

    protected override resetValue() {}

    private getOptions(): RadioOptions {
        const id = this.targetId(this.generatedId);
        return {
            value: this.value ?? '',
            id,
            defaultId: id,
            defaultInputId: id,
            disabled: this.disabled,
            readOnly: this.readOnly,
            required: this.required,
            nativeButton: this.target?.localName === 'button',
            group: this.group?.machine ?? null,
            field: this.field?.machine ?? null,
            fieldItemDisabled: this.fieldItem?.itemDisabled ?? false,
            labelable: this.labelable
        };
    }
}
