import React from 'react';

import { AccordionItemMachine } from '@flippo-software/core-components/accordion';

import type { AccordionItemOptions } from '@flippo-software/core-components/accordion';

import { useMachine, useStoreState } from '~@lib/core';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { CollapsibleRootContext, useCollapsibleContextValue } from '../../Collapsible/root/CollapsibleRootContext';
import { useAccordionRootContext } from '../root/AccordionRootContext';

import type { AccordionRoot } from '../root/AccordionRoot';

import { AccordionItemContext } from './AccordionItemContext';
import { accordionStyleHookMapping } from './styleHooks';

import type { AccordionItemContextValue } from './AccordionItemContext';

/**
 * Groups an accordion header with the corresponding panel.
 * Renders a `<div>` element.
 */
export function AccordionItem(componentProps: AccordionItemProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled,
        onOpenChange,
        value,
        ref,
        ...elementProps
    } = componentProps;

    const { accordion, state: rootState } = useAccordionRootContext();

    const fallbackValue = useHeadlessUiId() as string;
    const defaultTriggerId = useHeadlessUiId() as string;
    const defaultPanelId = useHeadlessUiId() as string;

    const item = useMachine((options) => new AccordionItemMachine(accordion, options), {
        value,
        disabled,
        onOpenChange: onOpenChange as AccordionItemOptions['onOpenChange'],
        fallbackValue,
        defaultTriggerId,
        defaultPanelId
    });
    const { index } = useStoreState(item.store);

    const collapsibleContext = useCollapsibleContextValue(item.collapsible);

    const itemDisabled = item.disabled;
    const open = item.isOpen;
    const state: AccordionItem.State = React.useMemo(
        () => ({ ...rootState, index, disabled: itemDisabled, open }),
        [rootState, index, itemDisabled, open]
    );

    const itemContext: AccordionItemContextValue = React.useMemo(
        () => ({ item, state, defaultTriggerId }),
        [item, state, defaultTriggerId]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, item.listItem.setElement],
        props: elementProps,
        customStyleHookMapping: accordionStyleHookMapping
    });

    return (
        <CollapsibleRootContext.Provider value={collapsibleContext}>
            <AccordionItemContext.Provider value={itemContext}>{element}</AccordionItemContext.Provider>
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
} & HeadlessUIComponentProps<'div', AccordionItem.State> & { disabled?: boolean };

export type AccordionItemChangeEventReason = typeof REASONS.triggerPress | typeof REASONS.none;

export type AccordionItemChangeEventDetails = HeadlessUIChangeEventDetails<AccordionItem.ChangeEventReason>;

export namespace AccordionItem {
    export type State = AccordionItemState;
    export type Props = AccordionItemProps;
    export type ChangeEventReason = AccordionItemChangeEventReason;
    export type ChangeEventDetails = AccordionItemChangeEventDetails;
}
