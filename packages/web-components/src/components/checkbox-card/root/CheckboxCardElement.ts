import { CheckboxCardMachine } from '@flippo-software/core-components/checkbox-card';
import { mergeProps } from '@flippo-software/core-components/props';
import { effect, untracked } from '@flippo-software/store';

import type { CheckboxCardChangeEventDetails, CheckboxCardOptions } from '@flippo-software/core-components/checkbox-card';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext, requestAncestorContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { CheckboxGroupContext } from '../../checkbox/root/CheckboxRootContext';
import { CheckboxGroupElement } from '../../checkbox-group/root/CheckboxGroupElement';
import { ControlElement } from '../../field/utils/ControlElement';

import { type CheckboxCardCheckedChangeDetail, CheckboxCardContext } from './CheckboxCardRootContext';

/**
 * A card that is checked or not, like a checkbox with rich content. It takes part in forms like a checkbox.
 *
 * Attributes: `checked` (controlled), `default-checked`, `indeterminate`, `disabled`, `required`, `name`, `value`.
 * Events: `checked-change` (cancelable; `detail: { checked, reason }`).
 * State attributes: `data-checked` / `data-unchecked`, `data-indeterminate`, `data-disabled`, `data-required`, and
 * those of the field.
 */
export class CheckboxCardElement extends ControlElement.withAttributes({
    /**
     * The controlled checked state.
     * Uncontrolled counterpart: `default-checked`.
     */
    checked: 'boolean',
    /**
     * The initial checked state (uncontrolled).
     * @default false
     */
    'default-checked': 'boolean',
    /**
     * Whether the checkbox is in an indeterminate (neither checked nor unchecked) state.
     * @default false
     */
    indeterminate: 'boolean',
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled: 'boolean',
    /**
     * Whether the user must check this before submitting a form.
     * @default false
     */
    required: 'boolean',
    /** Identifies the field when a form is submitted (standalone mode). */
    name: 'string',
    /**
     * The value submitted in a CheckboxGroup or form.
     * Required when used inside CheckboxGroup.
     */
    value: 'string'
}) {
    private card!: CheckboxCardMachine;

    private group: CheckboxGroupElement | undefined;

    private readonly fieldId = createId('checkbox-card');

    constructor() {
        super();
        declareProvider(this, CheckboxCardContext);
    }

    get machine(): CheckboxCardMachine {
        return this.card;
    }

    protected override requestControlContexts(callback: () => void) {
        return requestAncestorContext(this, CheckboxGroupContext, CheckboxGroupElement, (group) => {
            this.group = group;
            callback();
        });
    }

    protected override createParts() {
        this.card = new CheckboxCardMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.card.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.card.afterCommit();
    }

    protected override connectParts() {
        const { card, formControl } = this;
        const disconnect = card.connect();
        card.setInputElement(formControl.input);
        const stopProviding = provideContext(this, CheckboxCardContext, this);
        // Registered again when the value changes: the registration holds it.
        const stopRegistering = effect(() => {
            card.checked;
            card.name;
            return untracked(() => card.registerField());
        });
        const stopSyncing = effect(() => {
            const { checked } = card.getState();
            const inputProps = card.getInputProps();
            const value = checked ? (this.value ?? 'on') : card.getUncheckedInputProps() ? 'off' : null;
            const formValue = this.toFormValue(card.name, value);
            untracked(() => {
                formControl.applyInput(inputProps);
                card.syncInput();
                formControl.sync(formValue, this.target);
            });
        });
        return () => {
            stopSyncing();
            stopRegistering();
            stopProviding();
            card.setInputElement(null);
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.card?.setCardElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.card.getRootProps(), CheckboxCardMachine.attrs(this.card.getState()));
    }

    protected override resetValue() {
        if (this.checked === undefined) {
            this.card.store.set('checked', this.defaultChecked ?? false);
        }
    }

    private getOptions(): CheckboxCardOptions {
        return {
            checked: this.checked,
            defaultChecked: this.defaultChecked ?? false,
            indeterminate: this.indeterminate ?? false,
            disabled: (this.disabled ?? false) || this.formDisabled,
            required: this.required ?? false,
            name: this.name,
            value: this.value,
            field: this.field?.machine ?? null,
            fieldItemDisabled: this.fieldItem?.itemDisabled ?? false,
            labelable: this.labelable,
            group: this.group?.machine ?? null,
            fieldId: this.fieldId,
            onCheckedChange: (checked: boolean, eventDetails: CheckboxCardChangeEventDetails) => {
                this.emit(
                    'checked-change',
                    { checked, reason: eventDetails.reason } satisfies CheckboxCardCheckedChangeDetail,
                    eventDetails
                );
            }
        };
    }
}
