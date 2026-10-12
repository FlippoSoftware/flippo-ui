import React from 'react';
import * as ReactDOM from 'react-dom';

import {
    NavigationMenuContentMachine,
    navigationMenuContentStateAttributesMapping
} from '@flippo-software/core-components/navigation-menu';
import { useIsoLayoutEffect } from '@flippo-software/hooks';

import type { TransitionStatus } from '@flippo-software/hooks';

import { toReactProps, useMachineState, useTracker } from '~@lib/core';
import { FloatingNode } from '~@lib/floating';
import { useDirection, useRenderElement } from '~@lib/hooks';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { CompositeMachineProvider } from '../../Composite/root/CompositeMachineProvider';
import { useNavigationMenuItemContext } from '../item/NavigationMenuItemContext';
import { useNavigationMenuRoot } from '../root/NavigationMenuRootContext';

const stateAttributesMapping = navigationMenuContentStateAttributesMapping as StateAttributesMapping<NavigationMenuContent.State>;

/**
 * A container for the content of the navigation menu item that is moved into the popup
 * when the item is active.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
export function NavigationMenuContent(componentProps: NavigationMenuContentProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const root = useNavigationMenuRoot();
    const { value: itemValue } = useNavigationMenuItemContext();
    const direction = useDirection();

    const [content] = React.useState(() => new NavigationMenuContentMachine(root, itemValue, direction));
    useIsoLayoutEffect(() => content.connect(), [content]);

    const state: NavigationMenuContent.State = useMachineState(content);
    const track = useTracker();
    const portalContainer = track(() => content.getPortalContainer());

    const element = useRenderElement('div', componentProps, {
        enabled: portalContainer != null,
        state,
        ref: [ref, content.setElement],
        props: [elementProps, (props) => track(() => toReactProps(content.getContentProps(props)))],
        customStyleHookMapping: stateAttributesMapping
    });

    if (!portalContainer) {
        return null;
    }

    return ReactDOM.createPortal(
        <FloatingNode id={`${root.nodeId}-content`}>
            <CompositeMachineProvider composite={content.composite}>{element}</CompositeMachineProvider>
        </FloatingNode>,
        portalContainer
    );
}

export type NavigationMenuContentState = {
    /**
     * If `true`, the component is open.
     */
    open: boolean;
    /**
     * The transition status of the component.
     */
    transitionStatus: TransitionStatus;
    /**
     * The direction of the activation.
     */
    activationDirection: 'left' | 'right' | 'up' | 'down' | null;
};

export type NavigationMenuContentProps = {} & HeadlessUIComponentProps<'div', NavigationMenuContent.State>;

export namespace NavigationMenuContent {
    export type State = NavigationMenuContentState;
    export type Props = NavigationMenuContentProps;
}
