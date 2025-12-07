import React from 'react';

import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import {
    NavigationMenuItemContext
} from './NavigationMenuItemContext';

import type { NavigationMenuItemContextValue } from './NavigationMenuItemContext';

/**
 * An individual navigation menu item.
 * Renders a `<li>` element.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
export function NavigationMenuItem(componentProps: NavigationMenuItemProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        value: valueProp,
        ...elementProps
    } = componentProps;

    const fallbackValue = useHeadlessUiId();
    const value = valueProp ?? fallbackValue;

    const element = useRenderElement('li', componentProps, {
        ref,
        props: elementProps
    });

    const contextValue: NavigationMenuItemContextValue = React.useMemo(() => ({ value }), [value]);

    return (
        <NavigationMenuItemContext.Provider value={contextValue}>
            {element}
        </NavigationMenuItemContext.Provider>
    );
}

export type NavigationMenuItemState = {};

export type NavigationMenuItemProps = {
    /**
     * A unique value that identifies this navigation menu item.
     * If no value is provided, a unique ID will be generated automatically.
     * Use when controlling the navigation menu programmatically.
     */
    value?: any;
} & HeadlessUIComponentProps<'li', NavigationMenuItem.State>;

export namespace NavigationMenuItem {
    export type State = NavigationMenuItemState;
    export type Props = NavigationMenuItemProps;
}
