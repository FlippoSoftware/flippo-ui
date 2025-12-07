import React from 'react';

import { EMPTY_OBJECT } from '~@lib/constants';
import { useRenderElement } from '~@lib/hooks';
import { useDismiss } from '~@packages/floating-ui-react';
import { getTarget } from '~@packages/floating-ui-react/utils';
import { getEmptyRootContext } from '~@packages/floating-ui-react/utils/getEmptyRootContext';

import type { HeadlessUIComponentProps, HTMLProps } from '~@lib/types';

import { CompositeRoot } from '../../Composite/root/CompositeRoot';
import { useNavigationMenuRootContext } from '../root/NavigationMenuRootContext';
import { NAVIGATION_MENU_TRIGGER_IDENTIFIER } from '../utils/constants';

import { NavigationMenuDismissContext } from './NavigationMenuDismissContext';

/**
 * Contains a list of navigation menu items.
 * Renders a `<ul>` element.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
export function NavigationMenuList(componentProps: NavigationMenuListProps) {
    const {
        className,
        render,
        ref,
        ...elementProps
    } = componentProps;

    const {
        orientation,
        open,
        floatingRootContext,
        positionerElement,
        value,
        nested
    }
    = useNavigationMenuRootContext();

    const fallbackContext = React.useMemo(() => getEmptyRootContext(), []);
    const context = floatingRootContext || fallbackContext;
    const interactionsEnabled = positionerElement ? true : !value;

    const dismiss = useDismiss(context, {
        enabled: interactionsEnabled,
        outsidePressEvent: 'intentional',
        outsidePress(event) {
            const target = getTarget(event) as HTMLElement | null;
            const closestNavigationMenuTrigger = target?.closest(
                `[${NAVIGATION_MENU_TRIGGER_IDENTIFIER}]`
            );
            return closestNavigationMenuTrigger === null;
        }
    });

    const dismissProps = floatingRootContext ? dismiss : undefined;

    const state: NavigationMenuList.State = React.useMemo(
        () => ({
            open
        }),
        [open]
    );

    // `stopEventPropagation` won't stop the propagation if the end of the list is reached,
    // but we want to block it in this case.
    // When nested, skip this handler so arrow keys can reach the parent CompositeRoot.
    const defaultProps: HTMLProps = nested
        ? {}
        : {
            onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
                const shouldStop
            = (orientation === 'horizontal'
              && (event.key === 'ArrowLeft' || event.key === 'ArrowRight'))
            || (orientation === 'vertical' && (event.key === 'ArrowUp' || event.key === 'ArrowDown'));

                if (shouldStop) {
                    event.stopPropagation();
                }
            }
        };

    const props = [dismissProps?.floating || EMPTY_OBJECT, defaultProps, elementProps];

    // When nested, skip the CompositeRoot wrapper so that triggers can participate
    // in the parent Content's composite navigation context. Also skip the onKeyDown
    // handler that blocks propagation so arrow keys can reach the parent CompositeRoot.
    const element = useRenderElement('ul', componentProps, {
        state,
        ref,
        props,
        enabled: nested
    });

    if (nested) {
        return (
            <NavigationMenuDismissContext.Provider value={dismissProps}>
                {element}
            </NavigationMenuDismissContext.Provider>
        );
    }

    return (
        <NavigationMenuDismissContext.Provider value={dismissProps}>
            <CompositeRoot
                render={render}
                className={className}
                state={state}
                refs={[ref]}
                props={props}
                loopFocus={false}
                orientation={orientation}
                tag={'ul'}
            />
        </NavigationMenuDismissContext.Provider>
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
