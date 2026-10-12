import React from 'react';

import { NavigationMenuListMachine } from '@flippo-software/core-components/navigation-menu';
import { useIsoLayoutEffect } from '@flippo-software/hooks';

import { toReactProps, useTracker } from '~@lib/core';
import { useDirection, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { CompositeMachineProvider } from '../../Composite/root/CompositeMachineProvider';
import { useNavigationMenuRoot } from '../root/NavigationMenuRootContext';

import { NavigationMenuDismissContext } from './NavigationMenuDismissContext';

/**
 * Contains a list of navigation menu items.
 * Renders a `<ul>` element.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
export function NavigationMenuList(componentProps: NavigationMenuList.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const root = useNavigationMenuRoot();
    const direction = useDirection();

    const [list] = React.useState(() => new NavigationMenuListMachine(root, direction));
    const track = useTracker();
    useIsoLayoutEffect(() => list.connect(), [list]);

    const open = track(() => root.open);
    const state: NavigationMenuList.State = React.useMemo(() => ({ open }), [open]);

    const element = useRenderElement('ul', componentProps, {
        state,
        ref: list.composite ? [ref, list.composite.setRoot] : ref,
        props: [elementProps, (props) => track(() => toReactProps(list.getListProps(props)))]
    });

    return (
        <NavigationMenuDismissContext value={list}>
            {/* Nested lists take part in the composite navigation of the parent content. */}
            {list.composite ? <CompositeMachineProvider composite={list.composite}>{element}</CompositeMachineProvider> : element}
        </NavigationMenuDismissContext>
    );
}

export type NavigationMenuListState = {
    /**
     * If `true`, the popup is open.
     */
    open: boolean;
};

export type NavigationMenuListProps = {} & HeadlessUIComponentProps<'ul', NavigationMenuList.State>;

export namespace NavigationMenuList {
    export type State = NavigationMenuListState;
    export type Props = NavigationMenuListProps;
}
