import React from 'react';

import { NavigationMenuRootMachine } from '@flippo-software/core-components/navigation-menu';

import { toReactProps, useMachine, useTracker } from '~@lib/core';
import { FloatingTree, useFloatingParentNodeId, useFloatingTree } from '~@lib/floating';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { NavigationMenuRootContext, NavigationMenuTreeContext } from './NavigationMenuRootContext';

/**
 * Groups all parts of the navigation menu.
 * Renders a `<nav>` element at the root, or `<div>` element when nested.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
export function NavigationMenuRoot(componentProps: NavigationMenuRootProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        defaultValue = null,
        value,
        onValueChange,
        actionsRef,
        delay = 50,
        closeDelay = 50,
        orientation = 'horizontal',
        onOpenChangeComplete,
        ref,
        ...elementProps
    } = componentProps;

    // Nested navigation menus join the floating tree of the parent content.
    const parentTree = useFloatingTree();
    const parentNodeId = useFloatingParentNodeId();
    const nodeId = useHeadlessUiId() as string;

    const root = useMachine(
        (options) =>
            new NavigationMenuRootMachine(options, {
                nodeId,
                parent: parentTree && parentNodeId != null ? { tree: parentTree, nodeId: parentNodeId } : null
            }),
        {
            value,
            defaultValue,
            onValueChange: onValueChange as never,
            onOpenChangeComplete,
            delay,
            closeDelay,
            orientation,
            hasActionsRef: actionsRef != null
        }
    );

    React.useImperativeHandle(actionsRef, () => root.actions, [root]);
    const track = useTracker();

    const nested = track(() => root.nested);
    const state: NavigationMenuRoot.State = React.useMemo(
        () => ({ open: track(() => root.open), nested }),
        [track(() => root.open), nested]
    );

    const element = useRenderElement(nested ? 'div' : 'nav', componentProps, {
        state,
        ref: [ref, root.setRootElement],
        props: [elementProps, (props) => track(() => toReactProps(root.getRootProps(props)))]
    });

    const content = (
        <NavigationMenuRootContext value={root}>
            <NavigationMenuTreeContext value={nodeId}>{element}</NavigationMenuTreeContext>
        </NavigationMenuRootContext>
    );

    return nested ? content : <FloatingTree tree={root.tree}>{content}</FloatingTree>;
}

export type NavigationMenuRootState = {
    /**
     * If `true`, the popup is open.
     */
    open: boolean;
    /**
     * Whether the navigation menu is nested.
     */
    nested: boolean;
};

export type NavigationMenuRootProps = {
    /**
     * A ref to imperative actions.
     */
    actionsRef?: React.RefObject<NavigationMenuRoot.Actions>;
    /**
     * Event handler called after any animations complete when the navigation menu is closed.
     */
    onOpenChangeComplete?: (open: boolean) => void;
    /**
     * The controlled value of the navigation menu item that should be currently open.
     * When non-nullish, the menu will be open. When nullish, the menu will be closed.
     *
     * To render an uncontrolled navigation menu, use the `defaultValue` prop instead.
     * @default null
     */
    value?: any;
    /**
     * The uncontrolled value of the item that should be initially selected.
     *
     * To render a controlled navigation menu, use the `value` prop instead.
     * @default null
     */
    defaultValue?: any;
    /**
     * Callback fired when the value changes.
     */
    onValueChange?: (value: any, eventDetails: NavigationMenuRoot.ChangeEventDetails) => void;
    /**
     * How long to wait before opening the navigation menu. Specified in milliseconds.
     * @default 50
     */
    delay?: number;
    /**
     * How long to wait before closing the navigation menu. Specified in milliseconds.
     * @default 50
     */
    closeDelay?: number;
    /**
     * The orientation of the navigation menu.
     * @default 'horizontal'
     */
    orientation?: 'horizontal' | 'vertical';
} & HeadlessUIComponentProps<'nav', NavigationMenuRoot.State>;

export type NavigationMenuRootActions = {
    unmount: () => void;
};

export type NavigationMenuRootChangeEventReason =
    | typeof REASONS.triggerPress
    | typeof REASONS.triggerHover
    | typeof REASONS.outsidePress
    | typeof REASONS.listNavigation
    | typeof REASONS.focusOut
    | typeof REASONS.escapeKey
    | typeof REASONS.linkPress
    | typeof REASONS.none
    | (string & {});

export type NavigationMenuRootChangeEventDetails = HeadlessUIChangeEventDetails<NavigationMenuRoot.ChangeEventReason>;

export namespace NavigationMenuRoot {
    export type State = NavigationMenuRootState;
    export type Props = NavigationMenuRootProps;
    export type Actions = NavigationMenuRootActions;
    export type ChangeEventReason = NavigationMenuRootChangeEventReason;
    export type ChangeEventDetails = NavigationMenuRootChangeEventDetails;
}
