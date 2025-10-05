import React from 'react';

import { AnimationFrame, useOpenInteractionType, useScrollLock } from '@flippo-ui/hooks';
import { useHeadlessUiId } from '~@lib/hooks';
import {
    FloatingNode,
    FloatingTree,
    useFloatingNodeId,
    useFloatingTree
} from '~@packages/floating-ui-react';

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
export function Menubar(props: Menubar.Props) {
    const {
        orientation = 'horizontal',
        loop = true,
        render,
        className,
        modal = true,
        disabled = false,
        id: idProp,
        ref,
        ...elementProps
    } = props;

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

    useScrollLock({
        enabled: modal && hasSubmenuOpen && openMethod !== 'touch',
        open: hasSubmenuOpen,
        mounted: hasSubmenuOpen,
        referenceElement: contentElement
    });

    const id = useHeadlessUiId(idProp);

    const state = React.useMemo(
        () => ({
            orientation,
            modal
        }),
        [orientation, modal]
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
                        refs={[ref, setContentElement, contentRef]}
                        props={[{ role: 'menubar', id }, interactionTypeProps, elementProps]}
                        orientation={orientation}
                        loop={loop}
                        highlightItemOnHover={hasSubmenuOpen}
                    />
                </MenubarContent>
            </FloatingTree>
        </MenubarContext.Provider>
    );
}

function MenubarContent(props: React.PropsWithChildren<object>) {
    const nodeId = useFloatingNodeId();
    const { events: menuEvents } = useFloatingTree()!;
    const openSubmenusRef = React.useRef(new Set<string>());
    const rootContext = useMenubarContext();

    React.useEffect(() => {
        function onSubmenuOpenChange(details: MenuOpenEventDetails) {
            if (!details.nodeId || details.parentNodeId !== nodeId) {
                return;
            }

            if (details.open) {
                openSubmenusRef.current.add(details.nodeId);
            }
            else {
                openSubmenusRef.current.delete(details.nodeId);
            }

            const isAnyOpen = openSubmenusRef.current.size > 0;
            if (isAnyOpen) {
                rootContext.setHasSubmenuOpen(true);
            }
            else if (rootContext.hasSubmenuOpen) {
                // wait for the next frame to set the state to make sure another menu doesn't open
                // immediately after the previous one is closed
                AnimationFrame.request(() => {
                    if (openSubmenusRef.current.size === 0) {
                        rootContext.setHasSubmenuOpen(false);
                    }
                });
            }
        }

        menuEvents.on('menuopenchange', onSubmenuOpenChange);

        return () => {
            menuEvents.off('menuopenchange', onSubmenuOpenChange);
        };
    }, [menuEvents, nodeId, rootContext]);

    return <FloatingNode id={nodeId}>{props.children}</FloatingNode>;
}

export namespace Menubar {
    export type State = object;

    export type Props = {
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
        loop?: boolean;
    } & HeadlessUIComponentProps<'div', State>;
}
