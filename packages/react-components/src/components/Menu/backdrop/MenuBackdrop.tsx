import React from 'react';

import { MenuBackdrop as MenuBackdropCore } from '@flippo-software/core-components/menu';

import type { TransitionStatus } from '@flippo-software/hooks/use-transition-status';

import { toReactProps, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping as baseMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

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
    const track = useTracker();
    const { open, transitionStatus } = track(() => MenuBackdropCore.getState(store));
    const state: MenuBackdrop.State = React.useMemo(() => ({ open, transitionStatus }), [open, transitionStatus]);

    const setElement = React.useCallback((element: HTMLDivElement | null) => MenuBackdropCore.setElement(store, element), [store]);

    return useRenderElement('div', componentProps, {
        ref: [ref, setElement],
        state,
        customStyleHookMapping: stateAttributesMapping,
        props: [elementProps, (props) => track(() => toReactProps(MenuBackdropCore.getProps(store, props)))]
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
