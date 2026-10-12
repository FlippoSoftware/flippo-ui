import React from 'react';
import * as ReactDOM from 'react-dom';

import { MenuRootMachine } from '@flippo-software/core-components/menu';
import { useId } from '@flippo-software/hooks';

import type { MenuHandle, MenuParent, MenuRootOptions } from '@flippo-software/core-components/menu';

import { useMachine, useStoreSelector } from '~@lib/core';
import { FloatingTree } from '~@lib/floating';
import { useDirection } from '~@lib/hooks';
import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { PayloadChildRenderFunction } from '~@lib/popupTypes';
import type { REASONS } from '~@lib/reason';

import { useMenubarContext } from '../../Menubar/MenubarContext';
import { useMenuSubmenuRootContext } from '../submenu-root/MenuSubmenuRootContext';

import { MenuRootContext, useMenuRootContext } from './MenuRootContext';

import type { MenuRootContextValue } from './MenuRootContext';

/**
 * Groups all parts of the menu.
 * Doesn't render its own HTML element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuRoot<Payload>(props: MenuRoot.Props<Payload>) {
    const parentMenuRootContext = useMenuRootContext(true);
    const menubar = useMenubarContext(true);
    const isSubmenu = useMenuSubmenuRootContext() !== undefined;

    const parent: MenuParent = React.useMemo(() => {
        if (isSubmenu && parentMenuRootContext) {
            return { type: 'menu', store: parentMenuRootContext.store };
        }
        if (menubar) {
            return { type: 'menubar', context: menubar.context };
        }
        return { type: undefined };
    }, [isSubmenu, parentMenuRootContext, menubar]);

    const setup = useMenuRootSetup<Payload>(props.handle);
    const root = useMachine((options) => new MenuRootMachine<Payload>(options, { ...setup, parent }), getMenuRootOptions(props));

    return (
        <MenuRootProvider root={root} parent={parent} actionsRef={props.actionsRef}>
            {props.children}
        </MenuRootProvider>
    );
}

/**
 * The IDs and React integration a menu root machine is created with.
 */
export function useMenuRootSetup<Payload>(handle?: MenuHandle<Payload>) {
    const rootId = useId() as string;
    const fallbackReferenceId = useHeadlessUiId() as string;
    const nodeId = useHeadlessUiId() as string;
    const floatingId = useHeadlessUiId();
    const direction = useDirection();
    return {
        store: handle?.store,
        rootId,
        fallbackReferenceId,
        nodeId,
        floatingId,
        direction,
        flushSync: ReactDOM.flushSync
    };
}

/**
 * The machine options of `Menu.Root` props.
 */
export function getMenuRootOptions(props: MenuRoot.Props<any>): MenuRootOptions {
    const {
        open,
        onOpenChange,
        onOpenChangeComplete,
        defaultOpen = false,
        disabled = false,
        modal,
        loopFocus = true,
        orientation = 'vertical',
        closeParentOnEsc = true,
        triggerId,
        defaultTriggerId = null,
        highlightItemOnHover = true
    } = props;
    return {
        open,
        onOpenChange: onOpenChange as MenuRootOptions['onOpenChange'],
        onOpenChangeComplete,
        defaultOpen,
        disabled,
        modal,
        loopFocus,
        orientation,
        closeParentOnEsc,
        triggerId,
        defaultTriggerId,
        highlightItemOnHover
    };
}

/**
 * Provides a menu root machine to the menu parts.
 */
export function MenuRootProvider<Payload>(props: {
    root: MenuRootMachine<Payload>;
    parent: MenuParent;
    actionsRef?: React.RefObject<MenuRoot.Actions | null> | undefined;
    children?: MenuRoot.Props<Payload>['children'];
}) {
    const { root, parent, actionsRef, children } = props;

    React.useImperativeHandle(actionsRef, () => root.actions, [root]);

    const payload = useStoreSelector(root.store, 'payload') as Payload | undefined;

    const context: MenuRootContextValue<Payload> = React.useMemo(() => ({ store: root.store, parent, root }), [root, parent]);

    const content = (
        <MenuRootContext value={context as MenuRootContextValue}>
            {typeof children === 'function' ? children({ payload }) : children}
        </MenuRootContext>
    );

    // Top-level and context menus own the floating tree of their submenus (menubars provide theirs).
    if (parent.type === undefined || parent.type === 'context-menu') {
        return <FloatingTree tree={root.tree}>{content}</FloatingTree>;
    }

    return content;
}

export type MenuRootProps<Payload = unknown> = {
    /**
     * Whether the menu is initially open.
     *
     * To render a controlled menu, use the `open` prop instead.
     * @default false
     */
    defaultOpen?: boolean;
    /**
     * Whether to loop keyboard focus back to the first item
     * when the end of the list is reached while using the arrow keys.
     * @default true
     */
    loopFocus?: boolean;
    /**
     * Whether moving the pointer over items should highlight them.
     * Disabling this prop allows CSS `:hover` to be differentiated from the `:focus` (`data-highlighted`) state.
     * @default true
     */
    highlightItemOnHover?: boolean;
    /**
     * Determines if the menu enters a modal state when open.
     * - `true`: user interaction is limited to the menu: document page scroll is locked and and pointer
     * interactions on outside elements are disabled.
     * - `false`: user interaction with the rest of the document is allowed.
     * @default true
     */
    modal?: boolean;
    /**
     * Event handler called when the menu is opened or closed.
     */
    onOpenChange?: (open: boolean, eventDetails: MenuRoot.ChangeEventDetails) => void;
    /**
     * Event handler called after any animations complete when the menu is closed.
     */
    onOpenChangeComplete?: (open: boolean) => void;
    /**
     * Whether the menu is currently open.
     */
    open?: boolean;
    /**
     * The visual orientation of the menu.
     * Controls whether roving focus uses up/down or left/right arrow keys.
     * @default 'vertical'
     */
    orientation?: MenuRoot.Orientation;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * When in a submenu, determines whether pressing the Escape key
     * closes the entire menu, or only the current child menu.
     * @default true
     */
    closeParentOnEsc?: boolean;
    /**
     * A ref to imperative actions.
     * - `unmount`: When specified, the menu will not be unmounted when closed.
     *    Instead, the `unmount` function must be called to unmount the menu manually.
     *   Useful when the menu's animation is controlled by an external library.
     * - `close`: When specified, the menu can be closed imperatively.
     */
    actionsRef?: React.RefObject<MenuRoot.Actions>;
    /**
     * ID of the trigger that the popover is associated with.
     * This is useful in conjuntion with the `open` prop to create a controlled popover.
     * There's no need to specify this prop when the popover is uncontrolled (i.e. when the `open` prop is not set).
     */
    triggerId?: string | null;
    /**
     * ID of the trigger that the popover is associated with.
     * This is useful in conjuntion with the `defaultOpen` prop to create an initially open popover.
     */
    defaultTriggerId?: string | null;
    /**
     * A handle to associate the popover with a trigger.
     * If specified, allows external triggers to control the popover's open state.
     */
    handle?: MenuHandle<Payload>;
    /**
     * The content of the popover.
     * This can be a regular React node or a render function that receives the `payload` of the active trigger.
     */
    children?: React.ReactNode | PayloadChildRenderFunction<Payload>;
};

export type MenuRootActions = {
    unmount: () => void;
    close: () => void;
};

export type MenuRootChangeEventReason =
    | typeof REASONS.triggerHover
    | typeof REASONS.triggerFocus
    | typeof REASONS.triggerPress
    | typeof REASONS.outsidePress
    | typeof REASONS.focusOut
    | typeof REASONS.listNavigation
    | typeof REASONS.escapeKey
    | typeof REASONS.itemPress
    | typeof REASONS.closePress
    | typeof REASONS.siblingOpen
    | typeof REASONS.cancelOpen
    | typeof REASONS.imperativeAction
    | typeof REASONS.none;

export type MenuRootChangeEventDetails = HeadlessUIChangeEventDetails<MenuRoot.ChangeEventReason> & {
    preventUnmountOnClose: () => void;
};

export type MenuRootOrientation = 'horizontal' | 'vertical';

export type { MenuParent } from '@flippo-software/core-components/menu';

export namespace MenuRoot {
    export type Props<Payload = unknown> = MenuRootProps<Payload>;
    export type Actions = MenuRootActions;
    export type ChangeEventReason = MenuRootChangeEventReason;
    export type ChangeEventDetails = MenuRootChangeEventDetails;
    export type Orientation = MenuRootOrientation;
}
