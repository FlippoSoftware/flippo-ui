import React from 'react';

import type { TransitionStatus } from '@flippo-ui/hooks';

import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping as baseMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useNavigationMenuRootContext } from '../root/NavigationMenuRootContext';

const stateAttributesMapping: StateAttributesMapping<NavigationMenuBackdrop.State> = {
    ...baseMapping,
    ...transitionStatusMapping
};

/**
 * A backdrop for the navigation menu popup.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
export function NavigationMenuBackdrop(componentProps: NavigationMenuBackdropProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { open, mounted, transitionStatus } = useNavigationMenuRootContext();

    const state: NavigationMenuBackdrop.State = React.useMemo(
        () => ({
            open,
            transitionStatus
        }),
        [open, transitionStatus]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: [{
            role: 'presentation',
            hidden: !mounted,
            style: {
                userSelect: 'none',
                WebkitUserSelect: 'none'
            }
        }, elementProps],
        customStyleHookMapping: stateAttributesMapping
    });

    return element;
}

export type NavigationMenuBackdropState = {
    /**
     * If `true`, the popup is open.
     */
    open: boolean;
    /**
     * The transition status of the popup.
     */
    transitionStatus: TransitionStatus;
};

export type NavigationMenuBackdropProps = {} & HeadlessUIComponentProps<'div', NavigationMenuBackdrop.State>;

export namespace NavigationMenuBackdrop {
    export type State = NavigationMenuBackdropState;
    export type Props = NavigationMenuBackdropProps;
}
