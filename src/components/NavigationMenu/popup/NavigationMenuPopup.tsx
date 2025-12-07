import React from 'react';

import type { TransitionStatus } from '@flippo-ui/hooks';

import { useDirection, useHeadlessUiId, useRenderElement } from '~@lib/hooks';
import { popupStateMapping as baseMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useNavigationMenuPositionerContext } from '../positioner/NavigationMenuPositionerContext';
import { useNavigationMenuRootContext } from '../root/NavigationMenuRootContext';

const stateAttributesMapping: StateAttributesMapping<NavigationMenuPopup.State> = {
    ...baseMapping,
    ...transitionStatusMapping
};

/**
 * A container for the navigation menu contents.
 * Renders a `<nav>` element.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
export function NavigationMenuPopup(componentProps: NavigationMenuPopupProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        id: idProp,
        ...elementProps
    } = componentProps;

    const { open, transitionStatus, setPopupElement } = useNavigationMenuRootContext();
    const positioning = useNavigationMenuPositionerContext();
    const direction = useDirection();

    const id = useHeadlessUiId(idProp);

    const state: NavigationMenuPopup.State = React.useMemo(
        () => ({
            open,
            transitionStatus,
            side: positioning.side,
            align: positioning.align,
            anchorHidden: positioning.anchorHidden
        }),
        [
            open,
            transitionStatus,
            positioning.side,
            positioning.align,
            positioning.anchorHidden
        ]
    );

    // Ensure popup size transitions correctly when anchored to `bottom` (side=top) or `right` (side=left).
    let isOriginSide = positioning.side === 'top';
    let isPhysicalLeft = positioning.side === 'left';
    if (direction === 'rtl') {
        isOriginSide = isOriginSide || positioning.side === 'inline-end';
        isPhysicalLeft = isPhysicalLeft || positioning.side === 'inline-end';
    }
    else {
        isOriginSide = isOriginSide || positioning.side === 'inline-start';
        isPhysicalLeft = isPhysicalLeft || positioning.side === 'inline-start';
    }

    const element = useRenderElement('nav', componentProps, {
        state,
        ref: [ref, setPopupElement],
        props: [{
            id,
            tabIndex: -1,
            style: isOriginSide
                ? {
                    position: 'absolute',
                    [positioning.side === 'top' ? 'bottom' : 'top']: '0',
                    [isPhysicalLeft ? 'right' : 'left']: '0'
                }
                : {}
        }, elementProps],
        customStyleHookMapping: stateAttributesMapping
    });

    return element;
}

export type NavigationMenuPopupState = {
    /**
     * If `true`, the popup is open.
     */
    open: boolean;
    /**
     * The transition status of the popup.
     */
    transitionStatus: TransitionStatus;
};

export type NavigationMenuPopupProps = {} & HeadlessUIComponentProps<'nav', NavigationMenuPopup.State>;

export namespace NavigationMenuPopup {
    export type State = NavigationMenuPopupState;
    export type Props = NavigationMenuPopupProps;
}
