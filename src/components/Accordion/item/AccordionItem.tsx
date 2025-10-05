import React from 'react';

import { useEventCallback, useMergedRef } from '@flippo-ui/hooks';
import { EMPTY_OBJECT } from '~@lib/constants';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

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
export function AccordionItem(componentProps: AccordionItem.Props) {
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

    const { ref: listItemRef, index } = useCompositeListItem(EMPTY_OBJECT);
    const mergedRef = useMergedRef(ref, listItemRef);

    const {
        disabled: contextDisabled,
        handleValueChange,
        state: rootState,
        value: openValues
    } = useAccordionRootContext();

    const value = valueProp ?? index;

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

    const onOpenChange = useEventCallback(
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
            hidden: !collapsible.mounted
        }),
        [collapsible.open, collapsible.disabled, collapsible.mounted]
    );

    const collapsibleContext: CollapsibleRootContextValue = React.useMemo(
        () => ({
            ...collapsible,
            onOpenChange,
            state: collapsibleState,
            transitionStatus: collapsible.transitionStatus
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
        [
            disabled,
            index,
            isOpen,
            rootState
        ]
    );

    const [triggerId, setTriggerId] = React.useState<string | undefined>(useHeadlessUiId());

    const accordionItemContext: AccordionItemContextValue = React.useMemo(
        () => ({
            open: isOpen,
            state,
            setTriggerId,
            triggerId
        }),
        [
            isOpen,
            state,
            setTriggerId,
            triggerId
        ]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: mergedRef,
        props: elementProps,
        customStyleHookMapping: accordionStyleHookMapping
    });

    return (
        <CollapsibleRootContext value={collapsibleContext}>
            <AccordionItemContext value={accordionItemContext}>
                {element}
            </AccordionItemContext>
        </CollapsibleRootContext>
    );
}

export type AccordionItemValue = any | null;

export namespace AccordionItem {
    export type State = {
        index: number;
        open: boolean;
    } & AccordionRoot.State;

    export type Props = {
        value?: AccordionItemValue;
    } & HeadlessUIComponentProps<'div', State> & Partial<Pick<useCollapsibleRoot.Parameters, 'disabled' | 'onOpenChange'>>;
}
