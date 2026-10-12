import { ListRegistryItem } from '@flippo-software/core-components/composite';
import { Store } from '@flippo-software/store';

import type { CompositeRootMachine } from '@flippo-software/core-components/composite';
import type { NavigationMenuChangeEventDetails, NavigationMenuRootMachine } from '@flippo-software/core-components/navigation-menu';
import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext, providesContext } from '../../../lib/context';

import type { NavigationMenuItemElement } from '../item/NavigationMenuItemElement';
import type { NavigationMenuListElement } from '../list/NavigationMenuListElement';

import type { NavigationMenuElement } from './NavigationMenuElement';

export type NavigationMenuValueChangeDetail = {
    value: unknown;
    reason: NavigationMenuChangeEventDetails['reason'];
};

/**
 * An element whose descendants move with the arrow keys: the list, or a content.
 */
export type NavigationMenuCompositeProvider = Element & {
    readonly composite: CompositeRootMachine | null;
};

export const NavigationMenuContext = createContext<NavigationMenuElement>('navigation-menu');

export const NavigationMenuListContext = createContext<NavigationMenuListElement>('navigation-menu-list');

export const NavigationMenuItemContext = createContext<NavigationMenuItemElement>('navigation-menu-item');

export const NavigationMenuCompositeContext = createContext<NavigationMenuCompositeProvider>('navigation-menu-composite');

const NAVIGATION_MENU_ROOT = [NavigationMenuContext] as const;

const NAVIGATION_MENU_ITEM = [NavigationMenuContext, NavigationMenuItemContext] as const;

export abstract class NavigationMenuPart extends ContextPart<typeof NAVIGATION_MENU_ROOT> {
    protected readonly contexts = NAVIGATION_MENU_ROOT;

    protected get root(): NavigationMenuRootMachine {
        return this.provided[0].machine;
    }
}

export abstract class NavigationMenuItemPart extends ContextPart<typeof NAVIGATION_MENU_ITEM> {
    protected readonly contexts = NAVIGATION_MENU_ITEM;

    protected get rootElement(): NavigationMenuElement {
        return this.provided[0];
    }

    protected get root(): NavigationMenuRootMachine {
        return this.provided[0].machine;
    }

    protected get itemValue(): string {
        return this.provided[1].itemValue;
    }
}

/**
 * Makes an element (a trigger, a link) an item of the arrow-key navigation of the closest list or content.
 */
export class CompositeItem {
    private item: ListRegistryItem | null = null;

    private element: HTMLElement | null = null;

    private readonly index = new Store({ index: -1 });

    private composite: CompositeRootMachine | null = null;

    attach(composite: CompositeRootMachine | null): () => void {
        this.composite = composite;
        if (!composite) {
            return () => {};
        }
        this.item = new ListRegistryItem(composite.registry, { onIndexChange: (index) => this.index.set('index', index) });
        this.item.setElement(this.element);
        const disconnect = this.item.connect();
        return () => {
            disconnect();
            this.item = null;
            this.composite = null;
        };
    }

    setElement(element: HTMLElement | null) {
        this.element = element;
        this.item?.setElement(element);
    }

    getProps(): Props {
        return this.composite ? this.composite.getItemProps(this.index.state.index) : {};
    }
}

/**
 * Finds the closest list or content around `element`.
 */
export function findCompositeProvider(element: Element): NavigationMenuCompositeProvider | null {
    for (let node = element.parentElement; node; node = node.parentElement) {
        if (providesContext(NavigationMenuCompositeContext)(node)) {
            // A list or a content (they declare the composite context).
            return node as unknown as NavigationMenuCompositeProvider;
        }
    }
    return null;
}
