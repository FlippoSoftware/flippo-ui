import React from 'react';

import { useMergedRef } from '@flippo-ui/hooks/use-merged-ref';
import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';

import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { CollapsibleRootContext } from '../../Collapsible/root/CollapsibleRootContext';
import { useCollapsibleRoot } from '../../Collapsible/root/useCollapsibleRoot';
import { useCompositeListItem } from '../../Composite/list/useCompositeListItem';
import { useAccordionRootContext } from '../root/AccordionRootContext';

import type { CollapsibleRoot } from '../../Collapsible/root/CollapsibleRoot';
import type { CollapsibleRootContextValue } from '../../Collapsible/root/CollapsibleRootContext';
import type { AccordionRoot } from '../root/AccordionRoot';

import { AccordionItemContext } from './AccordionItemContext';
import { accordionStyleHookMapping } from './styleHooks';

import type { AccordionItemContextValue } from './AccordionItemContext';

/**
 * Groups an accordion header with the corresponding panel.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Accordion](https://base-ui.com/react/components/accordion)
 */
export function AccordionItem(componentProps: AccordionItemProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled: disabledProp = false,
        onOpenChange: onOpenChangeProp,
        value: valueProp,
        ref,
        ...elementProps
    } = componentProps;

    const { ref: listItemRef, index } = useCompositeListItem();
    const mergedRef = useMergedRef(ref, listItemRef);

    const {
        disabled: contextDisabled,
        handleValueChange,
        state: rootState,
        value: openValues
    } = useAccordionRootContext();

    const fallbackValue = useHeadlessUiId();

    const value = valueProp ?? fallbackValue;

    const disabled = disabledProp || contextDisabled;

    const isOpen = React.useMemo(() => {
        if (!openValues) {
            return false;
        }

        for (let i = 0; i < openValues.length; i += 1) {
            if (openValues[i] === value) {
                return true;
            }
        }

        return false;
    }, [openValues, value]);

    const onOpenChange = useStableCallback(
        (nextOpen: boolean, eventDetails: CollapsibleRoot.ChangeEventDetails) => {
            onOpenChangeProp?.(nextOpen, eventDetails);

            if (eventDetails.isCanceled) {
                return;
            }

            handleValueChange(value, nextOpen);
        }
    );

    const collapsible = useCollapsibleRoot({
        open: isOpen,
        onOpenChange,
        disabled
    });

    const collapsibleState: CollapsibleRoot.State = React.useMemo(
        () => ({
            open: collapsible.open,
            disabled: collapsible.disabled,
            hidden: !collapsible.mounted,
            transitionStatus: collapsible.transitionStatus
        }),
        [collapsible.open, collapsible.disabled, collapsible.mounted, collapsible.transitionStatus]
    );

    const collapsibleContext: CollapsibleRootContextValue = React.useMemo(
        () => ({
            ...collapsible,
            onOpenChange,
            state: collapsibleState
        }),
        [collapsible, collapsibleState, onOpenChange]
    );

    const state: AccordionItem.State = React.useMemo(
        () => ({
            ...rootState,
            index,
            disabled,
            open: isOpen
        }),
        [disabled, index, isOpen, rootState]
    );

    const [triggerId, setTriggerId] = React.useState<string | undefined>(useHeadlessUiId());

    const accordionItemContext: AccordionItemContextValue = React.useMemo(
        () => ({
            open: isOpen,
            state,
            setTriggerId,
            triggerId
        }),
        [isOpen, state, setTriggerId, triggerId]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: mergedRef,
        props: elementProps,
        customStyleHookMapping: accordionStyleHookMapping
    });

    return (
        <CollapsibleRootContext.Provider value={collapsibleContext}>
            <AccordionItemContext.Provider value={accordionItemContext}>
                {element}
            </AccordionItemContext.Provider>
        </CollapsibleRootContext.Provider>
    );
}

export type AccordionItemState = {
    index: number;
    open: boolean;
} & AccordionRoot.State;

export type AccordionItemProps = {
    /**
     * A unique value that identifies this accordion item.
     * If no value is provided, a unique ID will be generated automatically.
     * Use when controlling the accordion programmatically, or to set an initial
     * open state.
     * @example
     * ```tsx
     * <Accordion.Root value={['a']}>
     *   <Accordion.Item value="a" /> // initially open
     *   <Accordion.Item value="b" /> // initially closed
     * </Accordion.Root>
     * ```
     */
    value?: any;
    /**
     * Event handler called when the panel is opened or closed.
     */
    onOpenChange?: (open: boolean, eventDetails: AccordionItem.ChangeEventDetails) => void;
} & HeadlessUIComponentProps<'div', AccordionItem.State> & Partial<Pick<useCollapsibleRoot.Parameters, 'disabled'>>;

export type AccordionItemChangeEventReason = typeof REASONS.triggerPress | typeof REASONS.none;

export type AccordionItemChangeEventDetails
    = HeadlessUIChangeEventDetails<AccordionItem.ChangeEventReason>;

export namespace AccordionItem {
    export type State = AccordionItemState;
    export type Props = AccordionItemProps;
    export type ChangeEventReason = AccordionItemChangeEventReason;
    export type ChangeEventDetails = AccordionItemChangeEventDetails;
}
