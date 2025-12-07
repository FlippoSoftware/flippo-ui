import React from 'react';

import { useId } from '@flippo-ui/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';

import { Menu } from '../../Menu';
import { MenuRootContext } from '../../Menu/root/MenuRootContext';

import type { MenuRoot } from '../../Menu/root/MenuRoot';

import { ContextMenuRootContext } from './ContextMenuRootContext';

import type { ContextMenuRootContextValue } from './ContextMenuRootContext';

/**
 * A component that creates a context menu activated by right clicking or long pressing.
 * Doesn’t render its own HTML element.
 *
 * Documentation: [Base UI Context Menu](https://base-ui.com/react/components/context-menu)
 */
export function ContextMenuRoot(props: ContextMenuRoot.Props) {
    const [anchor, setAnchor] = React.useState<ContextMenuRootContextValue['anchor']>({
        getBoundingClientRect() {
            return DOMRect.fromRect({
                width: 0,
                height: 0,
                x: 0,
                y: 0
            });
        }
    });

    const backdropRef = React.useRef<HTMLDivElement | null>(null);
    const internalBackdropRef = React.useRef<HTMLDivElement | null>(null);
    const actionsRef: ContextMenuRootContextValue['actionsRef'] = React.useRef(null);
    const positionerRef = React.useRef<HTMLElement | null>(null);
    const allowMouseUpTriggerRef = React.useRef(true);
    const initialCursorPointRef = React.useRef<{ x: number; y: number } | null>(null);
    const id = useId();

    const contextValue: ContextMenuRootContextValue = React.useMemo(
        () => ({
            anchor,
            setAnchor,
            actionsRef,
            backdropRef,
            internalBackdropRef,
            positionerRef,
            allowMouseUpTriggerRef,
            initialCursorPointRef,
            rootId: id
        }),
        [anchor, id]
    );

    return (
        <ContextMenuRootContext.Provider value={contextValue}>
            <MenuRootContext.Provider value={undefined}>
                <Menu.Root {...props} />
            </MenuRootContext.Provider>
        </ContextMenuRootContext.Provider>
    );
}

export type ContextMenuRootState = {};

export type ContextMenuRootProps = {
    /**
     * Event handler called when the menu is opened or closed.
     */
    onOpenChange?: (open: boolean, eventDetails: ContextMenuRoot.ChangeEventDetails) => void;
} & Omit<Menu.Root.Props, 'modal' | 'openOnHover' | 'delay' | 'closeDelay' | 'onOpenChange'>;

export type ContextMenuRootChangeEventReason = MenuRoot.ChangeEventReason;
export type ContextMenuRootChangeEventDetails
    = HeadlessUIChangeEventDetails<ContextMenuRoot.ChangeEventReason>;

export namespace ContextMenuRoot {
    export type State = ContextMenuRootState;
    export type Props = ContextMenuRootProps;
    export type ChangeEventReason = ContextMenuRootChangeEventReason;
    export type ChangeEventDetails = ContextMenuRootChangeEventDetails;
}
