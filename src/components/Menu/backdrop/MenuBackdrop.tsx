'use client';

import React from 'react';

import type { TransitionStatus } from '@flippo-ui/hooks';

import { useRenderElement } from '@lib/hooks';
import { popupStateMapping } from '@lib/popupStateMapping';
import { transitionStatusMapping } from '@lib/styleHookMapping';

import type { CustomStyleHookMapping } from '@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '@lib/types';

import { useContextMenuRootContext } from '../../ContextMenu/root/ContextMenuRootContext';
import { useMenuRootContext } from '../root/MenuRootContext';

const customStyleHookMapping: CustomStyleHookMapping<MenuBackdrop.State> = {
    ...popupStateMapping,
    ...transitionStatusMapping
};

/**
 * An overlay displayed beneath the menu popup.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuBackdrop(componentProps: MenuBackdrop.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const {
        open,
        mounted,
        transitionStatus,
        lastOpenChangeReason
    } = useMenuRootContext();
    const contextMenuContext = useContextMenuRootContext();

    const state: MenuBackdrop.State = React.useMemo(
        () => ({
            open,
            transitionStatus
        }),
        [open, transitionStatus]
    );

    return useRenderElement('div', componentProps, {
        ref: contextMenuContext?.backdropRef
            ? [ref, contextMenuContext.backdropRef]
            : ref,
        state,
        customStyleHookMapping,
        props: [{
            role: 'presentation',
            hidden: !mounted,
            style: {
                pointerEvents: lastOpenChangeReason === 'trigger-hover' ? 'none' : undefined,
                userSelect: 'none',
                WebkitUserSelect: 'none'
            }
        }, elementProps]
    });
}

export namespace MenuBackdrop {
    export type Props = HeadlessUIComponentProps<'div', State>;

    export type State = {
    /**
     * Whether the menu is currently open.
     */
        open: boolean;
        transitionStatus: TransitionStatus;
    };
}
