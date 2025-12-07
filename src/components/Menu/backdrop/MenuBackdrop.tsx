import React from 'react';

import type { TransitionStatus } from '@flippo-ui/hooks/use-transition-status';

import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping as baseMapping } from '~@lib/popupStateMapping';
import { REASONS } from '~@lib/reason';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useContextMenuRootContext } from '../../ContextMenu/root/ContextMenuRootContext';
import { useMenuRootContext } from '../root/MenuRootContext';

const stateAttributesMapping: StateAttributesMapping<MenuBackdrop.State> = {
    ...baseMapping,
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

    const { store } = useMenuRootContext();
    const open = store.useState('open');
    const mounted = store.useState('mounted');
    const transitionStatus = store.useState('transitionStatus');
    const lastOpenChangeReason = store.useState('lastOpenChangeReason');

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
        customStyleHookMapping: stateAttributesMapping,
        props: [{
            role: 'presentation',
            hidden: !mounted,
            style: {
                pointerEvents: lastOpenChangeReason === REASONS.triggerHover ? 'none' : undefined,
                userSelect: 'none',
                WebkitUserSelect: 'none'
            }
        }, elementProps]
    });
}

export type MenuBackdropState = {
    /**
     * Whether the menu is currently open.
     */
    open: boolean;
    transitionStatus: TransitionStatus;
};

export type MenuBackdropProps = {} & HeadlessUIComponentProps<'div', MenuBackdrop.State>;

export namespace MenuBackdrop {
    export type State = MenuBackdropState;
    export type Props = MenuBackdropProps;
}
