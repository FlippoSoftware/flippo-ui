import React from 'react';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { REASONS } from '~@lib/reason';
import { useFloatingTree } from '~@packages/floating-ui-react';

import type { HeadlessUIComponentProps, HTMLProps } from '~@lib/types';

import { CompositeItem } from '../../Composite/item/CompositeItem';
import {
    useNavigationMenuRootContext,
    useNavigationMenuTreeContext
} from '../root/NavigationMenuRootContext';
import { isOutsideMenuEvent } from '../utils/isOutsideMenuEvent';

/**
 * A link in the navigation menu that can be used to navigate to a different page or section.
 * Renders an `<a>` element.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
export function NavigationMenuLink(componentProps: NavigationMenuLinkProps) {
    const {
        className,
        render,
        active = false,
        closeOnClick = false,
        ref,
        ...elementProps
    } = componentProps;

    const {
        setValue,
        popupElement,
        positionerElement,
        rootRef
    } = useNavigationMenuRootContext();
    const nodeId = useNavigationMenuTreeContext();
    const tree = useFloatingTree();

    const state: NavigationMenuLink.State = React.useMemo(
        () => ({
            active
        }),
        [active]
    );

    const defaultProps: HTMLProps = {
        'aria-current': active ? 'page' : undefined,
        'tabIndex': undefined,
        onClick(event) {
            if (closeOnClick) {
                setValue(null, createChangeEventDetails(REASONS.linkPress, event.nativeEvent));
            }
        },
        onBlur(event) {
            if (
                positionerElement
                && popupElement
                && isOutsideMenuEvent(
                    {
                        currentTarget: event.currentTarget,
                        relatedTarget: event.relatedTarget as HTMLElement | null
                    },
                    {
                        popupElement,
                        rootRef,
                        tree,
                        nodeId
                    }
                )
            ) {
                setValue(null, createChangeEventDetails(REASONS.focusOut, event.nativeEvent));
            }
        }
    };

    return (
        <CompositeItem
            tag={'a'}
            render={render}
            className={className}
            state={state}
            refs={[ref]}
            props={[defaultProps, elementProps]}
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
