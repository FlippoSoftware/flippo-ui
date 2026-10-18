import { mergeProps } from '@flippo-software/core-components/props';
import { SwitchMachine } from '@flippo-software/core-components/switch';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';
import type { SwitchChangeEventDetails, SwitchOptions } from '@flippo-software/core-components/switch';

import { declareProvider, provideContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { ControlElement } from '../../field/utils/ControlElement';

import { type SwitchCheckedChangeDetail, SwitchContext } from './SwitchRootContext';

/**
 * A control that turns a setting on or off. It takes part in forms: it submits `on` under `name` while checked.
 *
 * Attributes: `checked` (controlled), `default-checked`, `disabled`, `read-only`, `required`, `name`.
 * Events: `checked-change` (cancelable; `detail: { checked, reason }`).
 * State attributes: `data-checked` / `data-unchecked`, `data-disabled`, `data-readonly`, `data-required`, and those of
 * the field.
 */
export class SwitchElement extends ControlElement.withAttributes({
    /**
     * Whether the switch is currently active.
     *
     * To render an uncontrolled switch, use the `default-checked` attribute instead.
     */
    checked: 'boolean',
    /**
     * Whether the switch is initially active.
     *
     * To render a controlled switch, use the `checked` attribute instead.
     * @default false
     */
    'default-checked': 'boolean',
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled: 'boolean',
    /**
     * Whether the user should be unable to activate or deactivate the switch.
     * @default false
     */
    'read-only': 'boolean',
    /**
     * Whether the user must activate the switch before submitting a form.
     * @default false
     */
    required: 'boolean',
    /** Identifies the field when a form is submitted. */
    name: 'string'
}) {
    private switchMachine!: SwitchMachine;

    private readonly generatedId = createId('switch');

    constructor() {
        super();
        declareProvider(this, SwitchContext);
    }

    get machine(): SwitchMachine {
        return this.switchMachine;
    }

    protected override createParts() {
        this.switchMachine = new SwitchMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.switchMachine.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.switchMachine.afterCommit();
    }

    protected override connectParts() {
        const { switchMachine, formControl } = this;
        const disconnect = switchMachine.connect();
        switchMachine.setInputElement(formControl.input);
        const stopProviding = provideContext(this, SwitchContext, this);
        const unregisterId = switchMachine.registerId();
        // Registered again when the value changes: the registration holds it.
        const stopRegisteringField = effect(() => {
            switchMachine.checked;
            switchMachine.name;
            return untracked(() => switchMachine.registerField());
        });
        const stopSyncing = effect(() => {
            const inputProps = switchMachine.getInputProps();
            const value = switchMachine.checked ? 'on' : switchMachine.getUncheckedInputProps() ? 'off' : null;
            const formValue = this.toFormValue(switchMachine.name, value);
            untracked(() => {
                formControl.applyInput(inputProps);
                formControl.sync(formValue, this.target);
            });
        });
        return () => {
            stopSyncing();
            stopRegisteringField();
            unregisterId();
            stopProviding();
            switchMachine.setInputElement(null);
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.switchMachine?.setSwitchElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.switchMachine.getRootProps(), SwitchMachine.attrs(this.switchMachine.getState()));
    }

    protected override resetValue() {
        if (this.checked === undefined) {
            this.switchMachine.store.set('checked', this.defaultChecked ?? false);
        }
    }

    private getOptions(): SwitchOptions {
        const id = this.targetId(this.generatedId);
        return {
            // The switch is its own control: labels point at it (`for`), not at its hidden input.
            id,
            defaultId: id,
            defaultInputId: id,
            checked: this.checked,
            defaultChecked: this.defaultChecked ?? false,
            disabled: (this.disabled ?? false) || this.formDisabled,
            readOnly: this.readOnly ?? false,
            required: this.required ?? false,
            name: this.name,
            nativeButton: this.target?.localName === 'button',
            field: this.field?.machine ?? null,
            labelable: this.labelable,
            onCheckedChange: (checked: boolean, eventDetails: SwitchChangeEventDetails) => {
                this.emit('checked-change', { checked, reason: eventDetails.reason } satisfies SwitchCheckedChangeDetail, eventDetails);
            }
        };
    }
}
