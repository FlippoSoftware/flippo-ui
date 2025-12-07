import React from 'react';

import { useOpenInteractionType, useScrollLock } from '@flippo-ui/hooks';

import { useHeadlessUiId } from '~@lib/hooks';
import {
    FloatingNode,
    FloatingTree,
    useFloatingNodeId,
    useFloatingTree
} from '~@packages/floating-ui-react';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { CompositeRoot } from '../Composite/root/CompositeRoot';

import type { MenuRoot } from '../Menu/root/MenuRoot';
import type { MenuOpenEventDetails } from '../Menu/utils/types';

import { MenubarContext, useMenubarContext } from './MenubarContext';

import type { MenubarContextValue } from './MenubarContext';

/**
 * The container for menus.
 *
 * Documentation: [Base UI Menubar](https://base-ui.com/react/components/menubar)
 */
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
        orientation = 'horizontal',
        loopFocus = true,
        render,
        className,
        modal = true,
        disabled = false,
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;

    const [contentElement, setContentElement] = React.useState<HTMLElement | null>(null);
    const [hasSubmenuOpen, setHasSubmenuOpen] = React.useState(false);

    const {
        openMethod,
        triggerProps: interactionTypeProps,
        reset: resetOpenInteractionType
    } = useOpenInteractionType(hasSubmenuOpen);

    React.useEffect(() => {
        if (!hasSubmenuOpen) {
            resetOpenInteractionType();
        }
    }, [hasSubmenuOpen, resetOpenInteractionType]);

    useScrollLock(modal && hasSubmenuOpen && openMethod !== 'touch', contentElement);

    const id = useHeadlessUiId(idProp);

    const state = React.useMemo(
        () => ({
            orientation,
            modal,
            hasSubmenuOpen
        }),
        [orientation, modal, hasSubmenuOpen]
    );

    const contentRef = React.useRef<HTMLDivElement>(null);
    const allowMouseUpTriggerRef = React.useRef(false);

    const context: MenubarContextValue = React.useMemo(
        () => ({
            contentElement,
            setContentElement,
            setHasSubmenuOpen,
            hasSubmenuOpen,
            modal,
            disabled,
            orientation,
            allowMouseUpTriggerRef,
            rootId: id
        }),
        [
            contentElement,
            hasSubmenuOpen,
            modal,
            disabled,
            orientation,
            id
        ]
    );

    return (
        <MenubarContext.Provider value={context}>
            <FloatingTree>
                <MenubarContent>
                    <CompositeRoot
                      render={render}
                      className={className}
                      state={state}
                      stateAttributesMapping={menubarStateAttributesMapping}
                      refs={[ref, setContentElement, contentRef]}
                      props={[{ role: 'menubar', id }, interactionTypeProps, elementProps]}
                      orientation={orientation}
                      loopFocus={loopFocus}
                      highlightItemOnHover={hasSubmenuOpen}
                    />
                </MenubarContent>
            </FloatingTree>
        </MenubarContext.Provider>
    );
}

function MenubarContent(props: React.PropsWithChildren<{}>) {
    const nodeId = useFloatingNodeId();
    const { events: menuEvents } = useFloatingTree()!;
    const rootContext = useMenubarContext();

    React.useEffect(() => {
        function onSubmenuOpenChange(details: MenuOpenEventDetails) {
            if (!details.nodeId || details.parentNodeId !== nodeId) {
                return;
            }

            if (details.open) {
                if (!rootContext.hasSubmenuOpen) {
                    rootContext.setHasSubmenuOpen(true);
                }
            }
            else if (details.reason !== 'sibling-open' && details.reason !== 'list-navigation') {
                rootContext.setHasSubmenuOpen(false);
            }
        }

        menuEvents.on('menuopenchange', onSubmenuOpenChange);

        return () => {
            menuEvents.off('menuopenchange', onSubmenuOpenChange);
        };
    }, [menuEvents, nodeId, rootContext]);

    return <FloatingNode id={nodeId}>{props.children}</FloatingNode>;
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
