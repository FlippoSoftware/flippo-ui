import React from 'react';

import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { CollapsibleRootContext } from './CollapsibleRootContext';
import { collapsibleStyleHookMapping } from './styleHooks';
import { useCollapsibleRoot } from './useCollapsibleRoot';

import type { CollapsibleRootContextValue } from './CollapsibleRootContext';

/**
 * Groups all parts of the collapsible.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Collapsible](https://base-ui.com/react/components/collapsible)
 */
export function CollapsibleRoot(componentProps: CollapsibleRootProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        defaultOpen = false,
        disabled = false,
        onOpenChange: onOpenChangeProp,
        open,
        ref,
        ...elementProps
    } = componentProps;

    const onOpenChange = useStableCallback(onOpenChangeProp);

    const collapsible = useCollapsibleRoot({
        open,
        defaultOpen,
        onOpenChange,
        disabled
    });

    const state: CollapsibleRoot.State = React.useMemo(
        () => ({
            open: collapsible.open,
            disabled: collapsible.disabled,
            transitionStatus: collapsible.transitionStatus
        }),
        [collapsible.open, collapsible.disabled, collapsible.transitionStatus]
    );

    const contextValue: CollapsibleRootContextValue = React.useMemo(
        () => ({
            ...collapsible,
            onOpenChange,
            state
        }),
        [collapsible, onOpenChange, state]
    );

    // @ts-expect-error Collapsible accepts `render={null}`
    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: elementProps,
        customStyleHookMapping: collapsibleStyleHookMapping
    });

    if (componentProps.render !== null) {
        return (
            <CollapsibleRootContext.Provider value={contextValue}>
                {element}
            </CollapsibleRootContext.Provider>
        );
    }

    return (
        <CollapsibleRootContext.Provider value={contextValue}>
            {elementProps.children}
        </CollapsibleRootContext.Provider>
    );
}

export type CollapsibleRootState = {} & Pick<useCollapsibleRoot.ReturnValue, 'open' | 'disabled'>;

export type CollapsibleRootProps = {
    /**
     * Whether the collapsible panel is currently open.
     *
     * To render an uncontrolled collapsible, use the `defaultOpen` prop instead.
     */
    open?: boolean;
    /**
     * Whether the collapsible panel is initially open.
     *
     * To render a controlled collapsible, use the `open` prop instead.
     * @default false
     */
    defaultOpen?: boolean;
    /**
     * Event handler called when the panel is opened or closed.
     */
    onOpenChange?: (open: boolean, eventDetails: CollapsibleRootChangeEventDetails) => void;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    render?: HeadlessUIComponentProps<'div', CollapsibleRootState>['render'] | null;
} & Omit<HeadlessUIComponentProps<'div', CollapsibleRoot.State>, 'render'>;

export type CollapsibleRootChangeEventReason = typeof REASONS.triggerPress | typeof REASONS.none;
export type CollapsibleRootChangeEventDetails
    = HeadlessUIChangeEventDetails<CollapsibleRootChangeEventReason>;

export namespace CollapsibleRoot {
    export type State = CollapsibleRootState;
    export type Props = CollapsibleRootProps;
    export type ChangeEventReason = CollapsibleRootChangeEventReason;
    export type ChangeEventDetails = CollapsibleRootChangeEventDetails;
}
