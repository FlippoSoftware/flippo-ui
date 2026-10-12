import type {
    MenuChangeEventDetails,
    MenuItemMachine,
    MenuItemSetup,
    MenuRootMachine,
    MenuRootOptions
} from '@flippo-software/core-components/menu';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';

import type { ContextMenuElement } from '../../context-menu/root/ContextMenuElement';
import type { MenuGroupElement } from '../group/MenuGroupElement';
import type { MenuPositionerElement } from '../positioner/MenuPositionerElement';
import type { MenuRadioGroupElement } from '../radio-group/MenuRadioGroupElement';

import type { MenuElement } from './MenuElement';

export type MenuOpenChangeDetail = {
    open: boolean;
    reason: MenuChangeEventDetails['reason'];
};

/**
 * The machine a menu element drives: its options and its connection.
 */
export type MenuRootDriver = {
    setOptions(options: MenuRootOptions): void;
    afterCommit(): void;
    connect(): () => void;
};

export const MenuContext = createContext<MenuElement>('menu');

export const MenuPositionerContext = createContext<MenuPositionerElement>('menu-positioner');

const MENU_ROOT = [MenuContext] as const;

const MENU_ROOT_AND_POSITIONER = [MenuContext, MenuPositionerContext] as const;

/**
 * Base of the parts of a menu: they need the root.
 */
export abstract class MenuPart extends ContextPart<typeof MENU_ROOT> {
    protected readonly contexts = MENU_ROOT;

    protected get rootElement(): MenuElement {
        return this.provided[0];
    }

    protected get root(): MenuRootMachine {
        return this.rootElement.machine;
    }
}

/**
 * Base of the parts inside the positioner: the popup, the arrow and the items.
 */
export abstract class MenuPositionedPart extends ContextPart<typeof MENU_ROOT_AND_POSITIONER> {
    protected readonly contexts = MENU_ROOT_AND_POSITIONER;

    protected get rootElement(): MenuElement {
        return this.provided[0];
    }

    protected get root(): MenuRootMachine {
        return this.rootElement.machine;
    }

    protected get positionerElement(): MenuPositionerElement {
        return this.provided[1];
    }
}

export type MenuCheckedChangeDetail = {
    checked: boolean;
    reason: MenuChangeEventDetails['reason'];
};

export type MenuValueChangeDetail = {
    value: string;
    reason: MenuChangeEventDetails['reason'];
};

/**
 * The checkbox and radio items, for their indicators.
 */
export type MenuCheckableItem = HTMLElement & {
    readonly itemState: { disabled: boolean; highlighted: boolean; checked: boolean };
};

export const MenuCheckableItemContext = createContext<MenuCheckableItem>('menu-checkable-item');

export const MenuRadioGroupContext = createContext<MenuRadioGroupElement>('menu-radio-group');

export const MenuGroupContext = createContext<MenuGroupElement>('menu-group');

/**
 * Base of the items: an item of the list of the menu around it (through its positioner).
 */
export abstract class MenuItemPart extends MenuPositionedPart.withAttributes({
    label: 'string',
    disabled: 'boolean'
}) {
    protected abstract readonly item: Pick<MenuItemMachine, 'connect' | 'setElement'>;

    private readonly generatedId = createId('menu-item');

    protected override afterOptions() {}

    protected override connectParts() {
        return this.item.connect();
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.item?.setElement(element);
    }

    /**
     * The setup of the machine: the list of the menu's positioner and its floating tree node.
     */
    protected get setup(): MenuItemSetup {
        const positioner = this.positionerElement.machine;
        const root = this.rootElement;
        return {
            registry: positioner.items,
            nodeId: positioner.nodeId,
            contextMenu: 'contextMachine' in root ? (root as ContextMenuElement).contextMachine.context : undefined
        };
    }

    protected get baseOptions() {
        return {
            // An id written by the page is kept; otherwise the generated one is used.
            id: this.targetId(this.generatedId),
            label: this.label,
            disabled: this.disabled ?? false,
            nativeButton: this.target?.localName === 'button'
        };
    }
}

export const MENU_CHECKABLE_ITEM = [MenuCheckableItemContext] as const;

export const MENU_GROUP = [MenuGroupContext] as const;
