'use client';

import React from 'react';

import { useId } from '@flippo-ui/hooks';

import { Menu } from '../../Menu';
import { MenuRootContext } from '../../Menu/root/MenuRootContext';

import { ContextMenuRootContext } from './ContextMenuRootContext';

import type { TContextMenuRootContext } from './ContextMenuRootContext';

/**
 * A component that creates a context menu activated by right clicking or long pressing.
 * Doesn’t render its own HTML element.
 *
 * Documentation: [Base UI Context Menu](https://base-ui.com/react/components/context-menu)
 */
export function ContextMenuRoot(props: ContextMenuRoot.Props) {
    const [anchor, setAnchor] = React.useState<TContextMenuRootContext['anchor']>({
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
    const actionsRef: TContextMenuRootContext['actionsRef'] = React.useRef(null);
    const positionerRef = React.useRef<HTMLElement | null>(null);
    const allowMouseUpTriggerRef = React.useRef(true);
    const id = useId();

    const contextValue: TContextMenuRootContext = React.useMemo(
        () => ({
            anchor,
            setAnchor,
            actionsRef,
            backdropRef,
            internalBackdropRef,
            positionerRef,
            allowMouseUpTriggerRef,
            rootId: id
        }),
        [anchor, id]
    );

    return (
        <ContextMenuRootContext value={contextValue}>
            <MenuRootContext value={undefined}>
                <Menu.Root {...props} />
            </MenuRootContext>
        </ContextMenuRootContext>
    );
}

export namespace ContextMenuRoot {
    export type State = object;

    export type Props = Omit<Menu.Root.Props, 'modal' | 'openOnHover' | 'delay' | 'closeDelay'>;
}
