import React from 'react';

import { useEventCallback } from '@flippo-ui/hooks';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
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
export function CollapsibleRoot(componentProps: CollapsibleRoot.Props) {
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

    const onOpenChange = useEventCallback(onOpenChangeProp);

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
            <CollapsibleRootContext value={contextValue}>
                {element}
            </CollapsibleRootContext>
        );
    }

    return (
        <CollapsibleRootContext value={contextValue}>
            {elementProps.children}
        </CollapsibleRootContext>
    );
}

export namespace CollapsibleRoot {
    export type State = Pick<useCollapsibleRoot.ReturnValue, 'open' | 'disabled'>;

    export type Props = {
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
        onOpenChange?: (open: boolean, eventDetails: ChangeEventDetails) => void;
        /**
         * Whether the component should ignore user interaction.
         * @default false
         */
        disabled?: boolean;
        render?: HeadlessUIComponentProps<'div', State>['render'] | null;
    } & Omit<HeadlessUIComponentProps<'div', State>, 'render'>;

    export type ChangeEventReason = 'trigger-press' | 'none';
    export type ChangeEventDetails = HeadlessUIChangeEventDetails<ChangeEventReason>;
}
