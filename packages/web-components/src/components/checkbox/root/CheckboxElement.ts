import { CheckboxMachine } from '@flippo-software/core-components/checkbox';
import { mergeProps } from '@flippo-software/core-components/props';
import { effect, untracked } from '@flippo-software/store';

import type { CheckboxChangeEventDetails, CheckboxOptions } from '@flippo-software/core-components/checkbox';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext, requestAncestorContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { CheckboxGroupElement } from '../../checkbox-group/root/CheckboxGroupElement';
import { ControlElement } from '../../field/utils/ControlElement';

import { type CheckboxCheckedChangeDetail, CheckboxContext, CheckboxGroupContext } from './CheckboxRootContext';

/**
 * A checkbox: a form control that is checked or not (or indeterminate). It takes part in forms like an
 * `<input type="checkbox">`: it submits `value` (`on` by default) under `name` while checked.
 *
 * Attributes: `checked` (controlled), `default-checked`, `indeterminate`, `disabled`, `read-only`, `required`, `name`,
 * `value`, `parent` (in a checkbox group with `allValues`: checks or unchecks all).
 * Events: `checked-change` (cancelable; `detail: { checked, reason }`).
 * State attributes: `data-checked` / `data-unchecked` / `data-indeterminate`, `data-disabled`, `data-readonly`,
 * `data-required`, and those of the field.
 */
export class CheckboxElement extends ControlElement.withAttributes({
    /**
     * Whether the checkbox is currently ticked.
     *
     * To render an uncontrolled checkbox, use the `default-checked` attribute instead.
     */
    checked: 'boolean',
    /**
     * Whether the checkbox is initially ticked.
     *
     * To render a controlled checkbox, use the `checked` attribute instead.
     * @default false
     */
    'default-checked': 'boolean',
    /**
     * Whether the checkbox is in a mixed state: neither ticked, nor unticked.
     * @default false
     */
    indeterminate: 'boolean',
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled: 'boolean',
    /**
     * Whether the user should be unable to tick or untick the checkbox.
     * @default false
     */
    'read-only': 'boolean',
    /**
     * Whether the user must tick the checkbox before submitting a form.
     * @default false
     */
    required: 'boolean',
    /**
     * Identifies the field when a form is submitted.
     */
    name: 'string',
    /** The value of the selected checkbox. */
    value: 'string',
    /**
     * Whether the checkbox controls a group of child checkboxes.
     *
     * Must be used in a `<prefix>-checkbox-group`.
     * @default false
     */
    parent: 'boolean'
}) {
    private checkbox!: CheckboxMachine;

    private group: CheckboxGroupElement | undefined;

    private readonly generatedId = createId('checkbox');

    constructor() {
        super();
        declareProvider(this, CheckboxContext);
    }

    get machine(): CheckboxMachine {
        return this.checkbox;
    }

    protected override requestControlContexts(callback: () => void) {
        return requestAncestorContext(this, CheckboxGroupContext, CheckboxGroupElement, (group) => {
            this.group = group;
            callback();
        });
    }

    protected override createParts() {
        this.checkbox = new CheckboxMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.checkbox.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.checkbox.afterCommit();
    }

    protected override connectParts() {
        const { checkbox, formControl } = this;
        const disconnect = checkbox.connect();
        checkbox.setInputElement(formControl.input);
        const stopProviding = provideContext(this, CheckboxContext, this);
        const stopRegisteringId = effect(() => {
            checkbox.inputId;
            return untracked(() => checkbox.registerId());
        });
        // Registered again when the value changes: the registration holds it.
        const stopRegisteringField = effect(() => {
            checkbox.checked;
            checkbox.name;
            return untracked(() => checkbox.registerField());
        });
        const stopSyncing = effect(() => {
            const { checked, indeterminate } = checkbox.getState();
            const inputProps = checkbox.getInputProps();
            const value = checked && !indeterminate ? (checkbox.value ?? 'on') : checkbox.getUncheckedInputProps() ? 'off' : null;
            const formValue = this.toFormValue(this.parent ? undefined : checkbox.name, value);
            untracked(() => {
                formControl.applyInput(inputProps);
                checkbox.syncInput();
                formControl.sync(formValue, this.target);
            });
        });
        return () => {
            stopSyncing();
            stopRegisteringField();
            stopRegisteringId();
            stopProviding();
            checkbox.setInputElement(null);
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.checkbox?.setControlElement(element);
    }

    protected override getProps(): Props {
        const state = this.checkbox.getState();
        return mergeProps(this.checkbox.getRootProps(), CheckboxMachine.attrs(state));
    }

    protected override resetValue() {
        if (this.checked === undefined) {
            this.checkbox.store.set('checked', this.defaultChecked ?? false);
        }
    }

    private getOptions(): CheckboxOptions {
        const id = this.targetId(this.generatedId);
        return {
            // The checkbox is its own control: labels point at it (`for`), not at its hidden input.
            id,
            defaultId: id,
            checked: this.checked,
            defaultChecked: this.defaultChecked ?? false,
            indeterminate: this.indeterminate ?? false,
            disabled: (this.disabled ?? false) || this.formDisabled,
            readOnly: this.readOnly ?? false,
            required: this.required ?? false,
            name: this.name,
            value: this.value,
            parent: this.parent ?? false,
            nativeButton: this.target?.localName === 'button',
            field: this.field?.machine ?? null,
            fieldItemDisabled: this.fieldItem?.itemDisabled ?? false,
            labelable: this.labelable,
            group: this.group?.machine ?? null,
            onCheckedChange: (checked: boolean, eventDetails: CheckboxChangeEventDetails) => {
                this.emit('checked-change', { checked, reason: eventDetails.reason } satisfies CheckboxCheckedChangeDetail, eventDetails);
            }
        };
    }
}
