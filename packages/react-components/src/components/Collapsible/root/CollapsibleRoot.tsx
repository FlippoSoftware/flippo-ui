import React from 'react';

import { CollapsibleMachine } from '@flippo-software/core-components/collapsible';

import type { CollapsibleOptions } from '@flippo-software/core-components/collapsible';
import type { TransitionStatus } from '@flippo-software/hooks';

import { useMachine } from '~@lib/core';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { CollapsibleRootContext, useCollapsibleContextValue } from './CollapsibleRootContext';
import { collapsibleStyleHookMapping } from './styleHooks';

/**
 * Groups all parts of the collapsible.
 * Renders a `<div>` element.
 */
export function CollapsibleRoot(componentProps: CollapsibleRootProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        defaultOpen = false,
        disabled = false,
        onOpenChange,
        open,
        ref,
        ...elementProps
    } = componentProps;

    const defaultPanelId = useHeadlessUiId() as string;

    const collapsible = useMachine((options) => new CollapsibleMachine(options), {
        open,
        defaultOpen,
        onOpenChange: onOpenChange as CollapsibleOptions['onOpenChange'],
        disabled,
        defaultPanelId
    });

    const contextValue = useCollapsibleContextValue(collapsible);

    // @ts-expect-error Collapsible accepts `render={null}`
    const element = useRenderElement('div', componentProps, {
        state: contextValue.state,
        ref,
        props: elementProps,
        customStyleHookMapping: collapsibleStyleHookMapping
    });

    return (
        <CollapsibleRootContext.Provider value={contextValue}>
            {componentProps.render === null ? elementProps.children : element}
        </CollapsibleRootContext.Provider>
    );
}

export type CollapsibleRootState = {
    /**
     * Whether the collapsible panel is currently open.
     */
    open: boolean;
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
    /**
     * The transition status of the panel.
     */
    transitionStatus: TransitionStatus;
};

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
export type CollapsibleRootChangeEventDetails = HeadlessUIChangeEventDetails<CollapsibleRootChangeEventReason>;

export namespace CollapsibleRoot {
    export type State = CollapsibleRootState;
    export type Props = CollapsibleRootProps;
    export type ChangeEventReason = CollapsibleRootChangeEventReason;
    export type ChangeEventDetails = CollapsibleRootChangeEventDetails;
}
