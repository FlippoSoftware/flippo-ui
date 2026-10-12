import React from 'react';

import { getNavigationMenuLinkProps } from '@flippo-software/core-components/navigation-menu';

import { toReactProps } from '~@lib/core';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { CompositeItem } from '../../Composite/item/CompositeItem';
import { useNavigationMenuRootContext } from '../root/NavigationMenuRootContext';

/**
 * A link in the navigation menu that can be used to navigate to a different page or section.
 * Renders an `<a>` element.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
export function NavigationMenuLink(componentProps: NavigationMenuLinkProps) {
    const { className, render, active = false, closeOnClick = false, ref, ...elementProps } = componentProps;

    const root = useNavigationMenuRootContext();

    const state: NavigationMenuLink.State = React.useMemo(() => ({ active }), [active]);

    return (
        <CompositeItem
            tag='a'
            render={render}
            className={className}
            state={state}
            refs={[ref]}
            props={[elementProps, (props: object) => toReactProps(getNavigationMenuLinkProps(root, { active, closeOnClick }, props))]}
        />
    );
}

export type NavigationMenuLinkState = {
    /**
     * Whether the link is the currently active page.
     */
    active: boolean;
};

export type NavigationMenuLinkProps = {
    /**
     * Whether the link is the currently active page.
     * @default false
     */
    active?: boolean;
    /**
     * Whether to close the navigation menu when the link is clicked.
     * @default false
     */
    closeOnClick?: boolean;
} & HeadlessUIComponentProps<'a', NavigationMenuLink.State>;

export namespace NavigationMenuLink {
    export type State = NavigationMenuLinkState;
    export type Props = NavigationMenuLinkProps;
}
