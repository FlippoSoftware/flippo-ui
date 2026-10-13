import { Store } from '@flippo-software/store';

import { ListRegistry } from '~@components/composite/list/ListRegistry';
import { Connectable } from '~@lib/Connectable';

import type { MutableRef } from '~@lib/types';

import type { ComboboxRootMachine } from '../root/ComboboxRootMachine';

/**
 * State machine of `Combobox.Chips`: the container of the selected values' chips, with keyboard navigation.
 */
export class ComboboxChipsMachine extends Connectable {
    readonly store = new Store<{ highlightedChipIndex: number | undefined }>({ highlightedChipIndex: undefined });

    readonly registry: ListRegistry;

    private readonly root: ComboboxRootMachine;

    constructor(root: ComboboxRootMachine) {
        super();
        this.root = root;
        this.registry = new ListRegistry();
    }

    protected override onConnect() {
        this.connectChild(this.registry);
        this.addCleanup(
            this.root.store.subscribe(() => {
                if (this.root.store.state.open && this.store.state.highlightedChipIndex !== undefined) {
                    this.store.set('highlightedChipIndex', undefined);
                }
            })
        );
    }

    get chipsRef(): MutableRef<(HTMLElement | null)[]> {
        return this.registry.elementsRef;
    }

    get highlightedChipIndex(): number | undefined {
        return this.store.state.highlightedChipIndex;
    }

    setHighlightedChipIndex = (index: number | undefined) => {
        this.store.set('highlightedChipIndex', index);
    };

    setElement = (element: HTMLDivElement | null) => {
        this.root.store.state.chipsContainerRef.current = element;
    };

    protected override onDisconnect() {}
}
