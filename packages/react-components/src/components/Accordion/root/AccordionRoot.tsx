import React from 'react';

import { AccordionMachine } from '@flippo-software/core-components/accordion';

import type { AccordionOptions } from '@flippo-software/core-components/accordion';

import { toReactProps, useMachine, useTracker } from '~@lib/core';
import { useDirection, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps, Orientation } from '~@lib/types';

import { AccordionRootContext } from './AccordionRootContext';

import type { AccordionRootContextValue } from './AccordionRootContext';

const rootStateAttributesMapping = {
    value: () => null
};

/**
 * Groups all parts of the accordion.
 * Renders a `<div>` element.
 */
export function AccordionRoot(componentProps: AccordionRootProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled = false,
        hiddenUntilFound,
        keepMounted,
        loopFocus = true,
        onValueChange,
        multiple = false,
        orientation = 'vertical',
        value,
        defaultValue,
        ref,
        ...elementProps
    } = componentProps;

    const direction = useDirection();

    const accordion = useMachine((options) => new AccordionMachine(options), {
        disabled,
        hiddenUntilFound,
        keepMounted,
        loopFocus,
        onValueChange: onValueChange as AccordionOptions['onValueChange'],
        multiple,
        orientation,
        value,
        defaultValue,
        direction
    });
    const track = useTracker();

    const { value: openValues } = track(() => accordion.getState());
    const state: AccordionRoot.State = React.useMemo(
        () => ({ value: openValues, disabled, orientation }),
        [openValues, disabled, orientation]
    );

    const contextValue: AccordionRootContextValue = React.useMemo(() => ({ accordion, state }), [accordion, state]);

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: [toReactProps(accordion.getRootProps()), elementProps],
        customStyleHookMapping: rootStateAttributesMapping
    });

    return <AccordionRootContext.Provider value={contextValue}>{element}</AccordionRootContext.Provider>;
}

export type AccordionValue = (any | null)[];

export type AccordionRootState = {
    value: AccordionValue;
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
    orientation: Orientation;
};

export type AccordionRootProps = {
    /**
     * The controlled value of the item(s) that should be expanded.
     *
     * To render an uncontrolled accordion, use the `defaultValue` prop instead.
     */
    value?: AccordionValue;
    /**
     * The uncontrolled value of the item(s) that should be initially expanded.
     *
     * To render a controlled accordion, use the `value` prop instead.
     */
    defaultValue?: AccordionValue;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * Allows the browser’s built-in page search to find and expand the panel contents.
     *
     * Overrides the `keepMounted` prop and uses `hidden="until-found"`
     * to hide the element without removing it from the DOM.
     * @default false
     */
    hiddenUntilFound?: boolean;
    /**
     * Whether to keep the element in the DOM while the panel is closed.
     * This prop is ignored when `hiddenUntilFound` is used.
     * @default false
     */
    keepMounted?: boolean;
    /**
     * Whether to loop keyboard focus back to the first item
     * when the end of the list is reached while using the arrow keys.
     * @default true
     */
    loopFocus?: boolean;
    /**
     * Event handler called when an accordion item is expanded or collapsed.
     * Provides the new value as an argument.
     */
    onValueChange?: (value: AccordionValue, eventDetails: AccordionRootChangeEventDetails) => void;
    /**
     * Whether multiple items can be open at the same time.
     * @default true
     */
    multiple?: boolean;
    /**
     * The visual orientation of the accordion.
     * Controls whether roving focus uses left/right or up/down arrow keys.
     * @default 'vertical'
     */
    orientation?: Orientation;
} & HeadlessUIComponentProps<'div', AccordionRoot.State>;

export type AccordionRootChangeEventReason = typeof REASONS.triggerPress | typeof REASONS.none;

export type AccordionRootChangeEventDetails = HeadlessUIChangeEventDetails<AccordionRoot.ChangeEventReason>;

export namespace AccordionRoot {
    export type State = AccordionRootState;
    export type Props = AccordionRootProps;
    export type ChangeEventReason = AccordionRootChangeEventReason;
    export type ChangeEventDetails = AccordionRootChangeEventDetails;
}
