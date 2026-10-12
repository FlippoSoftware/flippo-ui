import React from 'react';

import { MenuSubmenuTriggerMachine } from '@flippo-software/core-components/menu';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';
import { triggerOpenStateMapping } from '~@lib/popupStateMapping';

import type { HeadlessUIComponentProps, NonNativeButtonProps } from '~@lib/types';

import { useMenuItemSetup } from '../item/useMenuItem';
import { useMenuRootContext } from '../root/MenuRootContext';
import { useMenuSubmenuRootContext } from '../submenu-root/MenuSubmenuRootContext';

/**
 * A menu item that opens a submenu.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuSubmenuTrigger(componentProps: MenuSubmenuTrigger.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        label,
        id: idProp,
        nativeButton = false,
        openOnHover = true,
        delay = 100,
        closeDelay = 0,
        disabled = false,
        ref,
        ...elementProps
    } = componentProps;

    // The submenu's store; the trigger is an item of the parent menu.
    const { store } = useMenuRootContext();
    const submenuRootContext = useMenuSubmenuRootContext();
    if (!submenuRootContext) {
        throw new Error('Base UI: <Menu.SubmenuTrigger> must be placed in <Menu.SubmenuRoot>.');
    }
    const parentStore = submenuRootContext.parentMenu;
    const setup = useMenuItemSetup();
    const id = useHeadlessUiId(idProp) as string;

    const trigger = useMachine((options) => new MenuSubmenuTriggerMachine(store, parentStore, options, setup), {
        id,
        label,
        nativeButton,
        disabled,
        openOnHover,
        delay,
        closeDelay
    });
    const track = useTracker();
    const state: MenuSubmenuTrigger.State = useMachineState(trigger);

    return useRenderElement('div', componentProps, {
        state,
        customStyleHookMapping: triggerOpenStateMapping,
        props: [elementProps, (props) => track(() => toReactProps(trigger.getSubmenuTriggerProps(props)))],
        ref: [ref, trigger.setElement]
    });
}

export type MenuSubmenuTriggerProps = {
    onClick?: React.MouseEventHandler<HTMLElement>;
    /**
     * Overrides the text label to use when the item is matched during keyboard text navigation.
     */
    label?: string;
    /**
     * @ignore
     */
    id?: string;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * How long to wait before the menu may be opened on hover. Specified in milliseconds.
     *
     * Requires the `openOnHover` prop.
     * @default 100
     */
    delay?: number;
    /**
     * How long to wait before closing the menu that was opened on hover.
     * Specified in milliseconds.
     *
     * Requires the `openOnHover` prop.
     * @default 0
     */
    closeDelay?: number;
    /**
     * Whether the menu should also open when the trigger is hovered.
     */
    openOnHover?: boolean;
} & NonNativeButtonProps &
    HeadlessUIComponentProps<'div', MenuSubmenuTrigger.State>;

export type MenuSubmenuTriggerState = {
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
    /**
     * Whether the item is highlighted.
     */
    highlighted: boolean;
    /**
     * Whether the menu is currently open.
     */
    open: boolean;
};

export namespace MenuSubmenuTrigger {
    export type Props = MenuSubmenuTriggerProps;
    export type State = MenuSubmenuTriggerState;
}
