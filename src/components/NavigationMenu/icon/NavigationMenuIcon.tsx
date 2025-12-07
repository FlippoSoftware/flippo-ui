import React from 'react';

import { useRenderElement } from '~@lib/hooks';
import { triggerOpenStateMapping } from '~@lib/popupStateMapping';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useNavigationMenuItemContext } from '../item/NavigationMenuItemContext';
import { useNavigationMenuRootContext } from '../root/NavigationMenuRootContext';

/**
 * An icon that indicates that the trigger button opens a menu.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
export function NavigationMenuIcon(componentProps: NavigationMenuIconProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { value: itemValue } = useNavigationMenuItemContext();
    const { open, value } = useNavigationMenuRootContext();

    const isActiveItem = open && value === itemValue;

    const state: NavigationMenuIcon.State = React.useMemo(
        () => ({
            open: isActiveItem
        }),
        [isActiveItem]
    );

    const element = useRenderElement('span', componentProps, {
        state,
        ref,
        props: [{ 'aria-hidden': true, 'children': '▼' }, elementProps],
        customStyleHookMapping: triggerOpenStateMapping
    });

    return element;
}

export type NavigationMenuIconState = {
    /**
     * Whether the navigation menu is open and the item is active.
     */
    open: boolean;
};

export type NavigationMenuIconProps = {} & HeadlessUIComponentProps<'span', NavigationMenuIcon.State>;

export namespace NavigationMenuIcon {
    export type State = NavigationMenuIconState;
    export type Props = NavigationMenuIconProps;
}
