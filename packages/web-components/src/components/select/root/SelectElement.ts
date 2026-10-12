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
    'default-value': 'string',
    open: 'boolean',
    'default-open': 'boolean',
    name: 'string',
    disabled: 'boolean',
    'read-only': 'boolean',
    required: 'boolean',
    multiple: 'boolean',
    modal: 'boolean',
    'highlight-item-on-hover': 'boolean',
    value: property<unknown>(),
    items: property<SelectRootOptions['items']>(),
    itemToStringLabel: property<SelectRootOptions['itemToStringLabel']>(),
    itemToStringValue: property<SelectRootOptions['itemToStringValue']>(),
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
