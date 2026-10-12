import React from 'react';

import { MenubarMachine } from '@flippo-software/core-components/menubar';

import { toReactProps, useMachine, useStoreState } from '~@lib/core';
import { FloatingNode, FloatingTree } from '~@lib/floating';
import { useDirection, useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { CompositeMachineProvider } from '../Composite/root/CompositeMachineProvider';

import type { MenuRoot } from '../Menu/root/MenuRoot';

import { MenubarContext } from './MenubarContext';

const menubarStateAttributesMapping: StateAttributesMapping<Menubar.State> = {
    hasSubmenuOpen(value) {
        return {
            'data-has-submenu-open': value ? 'true' : 'false'
        };
    }
};

/**
 * The container for menus.
 *
 * Documentation: [Base UI Menubar](https://base-ui.com/react/components/menubar)
 */
export function Menubar(componentProps: Menubar.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        orientation = 'horizontal',
        loopFocus = true,
        modal = true,
        disabled = false,
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;

    const id = useHeadlessUiId(idProp) as string;
    const nodeId = useHeadlessUiId() as string;
    const direction = useDirection();

    const menubar = useMachine((options) => new MenubarMachine(options, { id, nodeId, direction }), {
        orientation,
        loopFocus,
        modal,
        disabled
    });
    const { hasSubmenuOpen } = useStoreState(menubar.store);

    const state: Menubar.State = React.useMemo(() => ({ orientation, modal, hasSubmenuOpen }), [orientation, modal, hasSubmenuOpen]);

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, menubar.setElement],
        props: [elementProps, (props) => toReactProps(menubar.getMenubarProps(props))],
        customStyleHookMapping: menubarStateAttributesMapping
    });

    return (
        <MenubarContext value={menubar}>
            <FloatingTree tree={menubar.tree}>
                <FloatingNode id={nodeId}>
                    <CompositeMachineProvider composite={menubar.composite} highlightItemOnHover={hasSubmenuOpen}>
                        {element}
                    </CompositeMachineProvider>
                </FloatingNode>
            </FloatingTree>
        </MenubarContext>
    );
}

export type MenubarState = {
    /**
     * The orientation of the menubar.
     */
    orientation: MenuRoot.Orientation;
    /**
     * Whether the menubar is modal.
     */
    modal: boolean;
    /**
     * Whether any submenu within the menubar is open.
     */
    hasSubmenuOpen: boolean;
};

export type MenubarProps = {
    /**
     * Whether the menubar is modal.
     * @default true
     */
    modal?: boolean;
    /**
     * Whether the whole menubar is disabled.
     * @default false
     */
    disabled?: boolean;
    /**
     * The orientation of the menubar.
     * @default 'horizontal'
     */
    orientation?: MenuRoot.Orientation;
    /**
     * Whether to loop keyboard focus back to the first item
     * when the end of the list is reached while using the arrow keys.
     * @default true
     */
    loopFocus?: boolean;
} & HeadlessUIComponentProps<'div', Menubar.State>;

export namespace Menubar {
    export type State = MenubarState;
    export type Props = MenubarProps;
}
