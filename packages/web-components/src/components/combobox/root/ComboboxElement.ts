import { ComboboxRootMachine } from '@flippo-software/core-components/combobox';
import { effect, Store, untracked } from '@flippo-software/store';

import type { ComboboxChangeEventDetails, ComboboxRootOptions, ComboboxRootSetup } from '@flippo-software/core-components/combobox';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { property } from '../../../lib/MachineElement';
import { ControlElement } from '../../field/utils/ControlElement';

import {
    ComboboxContext,
    type ComboboxInputValueChangeDetail,
    type ComboboxOpenChangeDetail,
    type ComboboxRootDriver,
    type ComboboxValueChangeDetail
} from './ComboboxRootContext';

/**
 * A text input that filters a list of options to choose from: the root of the `-combobox-*` parts. It takes part in
 * forms: it submits the chosen value (each one, with `multiple`) under `name`.
 *
 * Without the `items` property, the options are the `<prefix>-combobox-item` elements: typing filters them by their
 * text (the hidden ones are out of the list).
 *
 * Attributes: `value` (controlled), `default-value`, `input-value` (controlled), `default-input-value`, `open`
 * (controlled), `default-open`, `name`, `multiple`, `disabled`, `read-only`, `required`, `open-on-input-click`
 * (`"false"`: only typing or the trigger opens it), `auto-highlight` (the first match is highlighted), `modal`,
 * `limit`, `auto-complete` (`list` by default, `both`, `inline`, `none`), `locale`.
 * Properties: `value`/`defaultValue` (any value, or an array with `multiple`), `items`, `filter`,
 * `itemToStringLabel`, `itemToStringValue`, `isItemEqualToValue`.
 * Events: `value-change` (cancelable; `detail: { value, reason }`), `input-value-change` (cancelable; `detail:
 * { inputValue, reason }`), `open-change` (cancelable; `detail: { open, reason }`), `open-change-complete`.
 */
export class ComboboxElement extends ControlElement.withAttributes({
    'default-value': 'string',
    'input-value': 'string',
    'default-input-value': 'string',
    open: 'boolean',
    'default-open': 'boolean',
    name: 'string',
    multiple: 'boolean',
    disabled: 'boolean',
    'read-only': 'boolean',
    required: 'boolean',
    'open-on-input-click': 'boolean',
    'auto-highlight': 'boolean',
    modal: 'boolean',
    limit: 'number',
    'auto-complete': ['list', 'both', 'inline', 'none'],
    locale: 'string',
    value: property<unknown>(),
    items: property<ComboboxRootOptions['items']>(),
    filter: property<ComboboxRootOptions['filter']>(),
    itemToStringLabel: property<ComboboxRootOptions['itemToStringLabel']>(),
    itemToStringValue: property<ComboboxRootOptions['itemToStringValue']>(),
    isItemEqualToValue: property<ComboboxRootOptions['isItemEqualToValue']>()
}) {
    /**
     * The parts registered by the children (the backdrop), in a store so that the positioner follows them.
     */
    readonly parts = new Store<{ backdrop: HTMLElement | null }>({ backdrop: null });

    /**
     * The items of the document (value → label), the options when `items` is not set.
     */
    private readonly documentItems = new Store<{ items: ReadonlyMap<unknown, string> }>({ items: new Map() });

    private root!: ComboboxRootMachine;

    private driver!: ComboboxRootDriver;

    private backdrop: HTMLDivElement | null = null;

    private readonly generatedId = createId('combobox');

    constructor() {
        super();
        declareProvider(this, ComboboxContext);
    }

    get machine(): ComboboxRootMachine {
        return this.root;
    }

    /**
     * The internal backdrop of modal comboboxes, in the shadow root.
     */
    get internalBackdrop(): HTMLDivElement {
        if (!this.backdrop) {
            this.backdrop = this.ownerDocument.createElement('div');
            this.shadowRoot?.prepend(this.backdrop);
        }
        return this.backdrop;
    }

    /**
     * Whether the options are the items of the document (no `items` property).
     */
    get usesDocumentItems(): boolean {
        return this.items === undefined;
    }

    /**
     * Registers an item of the document. Returns a function that unregisters it.
     */
    registerItem(value: unknown, label: string): () => void {
        const update = (change: (items: Map<unknown, string>) => void) => {
            const items = new Map(this.documentItems.state.items);
            change(items);
            this.documentItems.set('items', items);
        };
        update((items) => items.set(value, label));
        return () => update((items) => items.delete(value));
    }

    /**
     * Creates the machine of the combobox, and the machine the element drives (the same one, or e.g. the
     * autocomplete around it).
     */
    protected createRoot(setup: ComboboxRootSetup): { combobox: ComboboxRootMachine; owner: ComboboxRootDriver } {
        const combobox = new ComboboxRootMachine(this.getOptions(), setup);
        return {
            combobox,
            owner: {
                setOptions: () => combobox.setOptions(this.getOptions()),
                afterCommit: () => combobox.afterCommit(),
                connect: () => combobox.connect()
            }
        };
    }

    protected override createParts() {
        const { combobox, owner } = this.createRoot({
            defaultId: this.generatedId,
            field: this.field?.machine ?? null,
            labelable: this.labelable
        });
        this.root = combobox;
        this.driver = owner;
    }

    protected override applyOptions() {
        this.driver.setOptions();
    }

    protected override afterOptions() {
        this.driver.afterCommit();
    }

    protected override connectParts() {
        const { root, formControl } = this;
        const disconnect = this.driver.connect();
        root.setHiddenInputElement(formControl.input);
        const unregister = root.register();
        const stopProviding = provideContext(this, ComboboxContext, this);
        // The items of the document are the options: follow them.
        const stopFollowingItems = effect(() => {
            this.documentItems.state.items;
            untracked(() => this.invalidateOptions());
        });
        const stopSyncing = effect(() => {
            const inputProps = root.getHiddenInputProps();
            const name = root.field.name ?? this.name;
            let formValue: FormData | null = null;
            if (name) {
                formValue = new FormData();
                if (root.selectionMode === 'multiple') {
                    for (const input of root.getHiddenInputs()) {
                        formValue.append(input.name, input.value);
                    }
                } else if (inputProps.value !== undefined && inputProps.value !== '') {
                    formValue.append(name, String(inputProps.value));
                }
            }
            untracked(() => {
                formControl.applyInput(inputProps);
                formControl.sync(formValue, root.store.state.inputRef.current);
            });
        });
        return () => {
            stopSyncing();
            stopFollowingItems();
            stopProviding();
            unregister();
            root.setHiddenInputElement(null);
            disconnect();
        };
    }

    protected override getProps(): Props {
        return {};
    }

    protected override resetValue() {
        if (this.value === undefined) {
            this.root.store.set('selectedValue', this.defaultValue ?? (this.multiple ? [] : null));
        }
    }

    /**
     * The options of the combobox machine.
     */
    protected getOptions(): ComboboxRootOptions {
        const documentItems = this.documentItems.state.items;
        const { itemToStringLabel } = this;
        return {
            id: this.targetId(this.generatedId),
            selectionMode: this.multiple ? 'multiple' : 'single',
            selectedValue: this.value,
            defaultSelectedValue: this.defaultValue ?? null,
            inputValue: this.inputValue,
            defaultInputValue: this.defaultInputValue,
            open: this.open,
            defaultOpen: this.defaultOpen ?? false,
            name: this.name,
            disabled: (this.disabled ?? false) || this.formDisabled,
            readOnly: this.readOnly ?? false,
            required: this.required ?? false,
            openOnInputClick: this.openOnInputClick ?? true,
            autoHighlight: this.autoHighlight ?? false,
            modal: this.modal ?? false,
            limit: this.limit ?? -1,
            autoComplete: this.autoComplete ?? 'list',
            locale: this.locale,
            items: this.items ?? [...documentItems.keys()],
            filter: this.filter,
            itemToStringLabel:
                itemToStringLabel ??
                (this.items === undefined ? (item: unknown) => documentItems.get(item) ?? String(item ?? '') : undefined),
            itemToStringValue: this.itemToStringValue,
            isItemEqualToValue: this.isItemEqualToValue,
            onSelectedValueChange: (value: unknown, eventDetails: ComboboxChangeEventDetails) => {
                this.emit('value-change', { value, reason: eventDetails.reason } satisfies ComboboxValueChangeDetail, eventDetails);
            },
            onInputValueChange: (inputValue: string, eventDetails: ComboboxChangeEventDetails) => {
                const detail: ComboboxInputValueChangeDetail = { inputValue, reason: eventDetails.reason };
                this.emit('input-value-change', detail, eventDetails);
            },
            onOpenChange: (open: boolean, eventDetails: ComboboxChangeEventDetails) => {
                this.emit('open-change', { open, reason: eventDetails.reason } satisfies ComboboxOpenChangeDetail, eventDetails);
            },
            onOpenChangeComplete: (open: boolean) => {
                this.emit('open-change-complete', { open });
            }
        };
    }
}
