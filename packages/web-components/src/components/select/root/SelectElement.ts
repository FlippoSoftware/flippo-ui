import { SelectRootMachine } from '@flippo-software/core-components/select';
import { effect, Store, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';
import type { SelectChangeEventDetails, SelectRootOptions } from '@flippo-software/core-components/select';

import { declareProvider, provideContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { property } from '../../../lib/MachineElement';
import { ControlElement } from '../../field/utils/ControlElement';

import { SelectContext, type SelectOpenChangeDetail, type SelectValueChangeDetail } from './SelectRootContext';

/**
 * A button that opens a list of options to choose from: the root of the `-select-*` parts. It takes part in forms: it
 * submits the chosen value (each one, with `multiple`) under `name`.
 *
 * Attributes: `value` (controlled), `default-value`, `open` (controlled), `default-open`, `name`, `disabled`,
 * `read-only`, `required`, `multiple`, `modal` (`"false"` leaves the page usable while open),
 * `highlight-item-on-hover` (`"false"`: only the keyboard highlights items).
 * Properties: `value`/`defaultValue` (any value, or an array with `multiple`), `items` (the labels of the values:
 * `{ value: label }` or `[{ value, label }]`), `itemToStringLabel`, `itemToStringValue`, `isItemEqualToValue`.
 * Events: `value-change` (cancelable; `detail: { value, reason }`), `open-change` (cancelable; `detail: { open,
 * reason }`), `open-change-complete` (`detail: { open }`).
 */
export class SelectElement extends ControlElement.withAttributes({
    /**
     * The uncontrolled value of the select when it’s initially rendered.
     *
     * To render a controlled select, use the `value` attribute instead.
     */
    'default-value': 'string',
    /** Whether the select popup is currently open. */
    open: 'boolean',
    /**
     * Whether the select popup is initially open.
     *
     * To render a controlled select popup, use the `open` attribute instead.
     * @default false
     */
    'default-open': 'boolean',
    /** Identifies the field when a form is submitted. */
    name: 'string',
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled: 'boolean',
    /**
     * Whether the user should be unable to choose a different option from the select popup.
     * @default false
     */
    'read-only': 'boolean',
    /**
     * Whether the user must choose a value before submitting a form.
     * @default false
     */
    required: 'boolean',
    /**
     * Whether multiple items can be selected.
     * @default false
     */
    multiple: 'boolean',
    /**
     * Determines if the select enters a modal state when open.
     * - `true`: user interaction is limited to the select: document page scroll is locked and pointer interactions on outside elements are disabled.
     * - `false`: user interaction with the rest of the document is allowed.
     * @default true
     */
    modal: 'boolean',
    /**
     * Whether moving the pointer over items should highlight them.
     * Disabling this attribute allows CSS `:hover` to be differentiated from the `:focus` (`data-highlighted`) state.
     * @default true
     */
    'highlight-item-on-hover': 'boolean',
    /** The value of the select. Use when controlled. */
    value: property<unknown>(),
    /**
     * Data structure of the items rendered in the select popup.
     * When specified, `<prefix>-select-value` renders the label of the selected item instead of the raw value.
     */
    items: property<SelectRootOptions['items']>(),
    /**
     * When the item values are objects (the `value` property of the items), this function converts
     *  the object value to a string representation for display in the trigger.
     * If the shape of the object is `{ value, label }`, the label will be used automatically
     * without needing to specify this attribute.
     */
    itemToStringLabel: property<SelectRootOptions['itemToStringLabel']>(),
    /**
     * When the item values are objects (the `value` property of the items), this function converts
     *  the object value to a string representation for form submission.
     * If the shape of the object is `{ value, label }`, the value will be used automatically
     *  without needing to specify this attribute.
     */
    itemToStringValue: property<SelectRootOptions['itemToStringValue']>(),
    /**
     * Custom comparison logic used to determine if a select item value matches the current
     * selected value. Useful when item values are objects without matching referentially.
     * Defaults to `Object.is` comparison.
     */
    isItemEqualToValue: property<SelectRootOptions['isItemEqualToValue']>()
}) {
    /**
     * The parts registered by the children (the backdrop), in a store so that the positioner follows them.
     */
    readonly parts = new Store<{ backdrop: HTMLElement | null }>({ backdrop: null });

    private root!: SelectRootMachine;

    private backdrop: HTMLDivElement | null = null;

    private readonly generatedId = createId('select');

    constructor() {
        super();
        declareProvider(this, SelectContext);
    }

    get machine(): SelectRootMachine {
        return this.root;
    }

    /**
     * The internal backdrop of modal selects, in the shadow root, outside of the positioner: a press on it is outside.
     */
    get internalBackdrop(): HTMLDivElement {
        if (!this.backdrop) {
            this.backdrop = this.ownerDocument.createElement('div');
            this.shadowRoot?.prepend(this.backdrop);
        }
        return this.backdrop;
    }

    protected override createParts() {
        this.root = new SelectRootMachine(this.getOptions(), {
            defaultId: this.generatedId,
            field: this.field?.machine ?? null,
            labelable: this.labelable
        });
    }

    protected override applyOptions() {
        this.root.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.root.afterCommit();
    }

    protected override connectParts() {
        const { root, formControl } = this;
        const disconnect = root.connect();
        root.setInputElement(formControl.input);
        const unregister = root.register();
        const stopProviding = provideContext(this, SelectContext, this);
        const stopSyncing = effect(() => {
            const inputProps = root.getHiddenInputProps();
            const { name } = root;
            let formValue: FormData | null = null;
            if (name) {
                formValue = new FormData();
                const multiple = root.getHiddenInputs();
                if (root.multiple) {
                    for (const input of multiple) {
                        formValue.append(input.name, input.value);
                    }
                } else if (inputProps.value !== undefined && inputProps.value !== '') {
                    formValue.append(name, String(inputProps.value));
                }
            }
            untracked(() => {
                formControl.applyInput(inputProps);
                formControl.sync(formValue, root.store.state.triggerElement);
            });
        });
        return () => {
            stopSyncing();
            stopProviding();
            unregister();
            root.setInputElement(null);
            disconnect();
        };
    }

    protected override getProps(): Props {
        return {};
    }

    protected override resetValue() {
        if (this.value === undefined) {
            this.root.store.set('value', this.defaultValue ?? (this.multiple ? [] : null));
        }
    }

    private getOptions(): SelectRootOptions {
        return {
            id: this.targetId(this.generatedId),
            value: this.value,
            defaultValue: this.defaultValue,
            open: this.open,
            defaultOpen: this.defaultOpen ?? false,
            name: this.name,
            disabled: (this.disabled ?? false) || this.formDisabled,
            readOnly: this.readOnly ?? false,
            required: this.required ?? false,
            multiple: this.multiple ?? false,
            modal: this.modal ?? true,
            highlightItemOnHover: this.highlightItemOnHover ?? true,
            items: this.items,
            itemToStringLabel: this.itemToStringLabel,
            itemToStringValue: this.itemToStringValue,
            isItemEqualToValue: this.isItemEqualToValue,
            onValueChange: (value: unknown, eventDetails: SelectChangeEventDetails) => {
                this.emit('value-change', { value, reason: eventDetails.reason } satisfies SelectValueChangeDetail, eventDetails);
            },
            onOpenChange: (open: boolean, eventDetails: SelectChangeEventDetails) => {
                this.emit('open-change', { open, reason: eventDetails.reason } satisfies SelectOpenChangeDetail, eventDetails);
            },
            onOpenChangeComplete: (open: boolean) => {
                this.emit('open-change-complete', { open });
            }
        };
    }
}
