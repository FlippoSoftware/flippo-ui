import React from 'react';

import {
    AnimationFrame,
    useAnimationFrame,
    useControlledState,
    useEventCallback,
    useIsoLayoutEffect,
    useMergedRef,
    useOnMount
} from '@flippo-ui/hooks';
import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useDirection, useRenderElement } from '~@lib/hooks';
import { REASONS } from '~@lib/reason';
import { warn } from '~@lib/warn';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { HeadlessUIComponentProps, HTMLProps, Orientation } from '~@lib/types';

import { CollapsiblePanelDataAttributes } from '../../Collapsible/panel/CollapsiblePanelDataAttributes';
import { CompositeList } from '../../Composite/list/CompositeList';

import type { CollapsibleRoot } from '../../Collapsible/root/CollapsibleRoot';
import type { AnimationType, Dimensions } from '../../Collapsible/root/useCollapsibleRoot';

import { AccordionRootContext } from './AccordionRootContext';
import { AccordionRootDataAttributes } from './AccordionRootDataAttributes';

import type { AccordionRootContextValue } from './AccordionRootContext';

const rootStateAttributesMapping = {
    value: () => null
};

const EMPTY_ACCORDION_VALUE: AccordionValue = [];

/**
 * Groups all parts of the accordion.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Accordion](https://base-ui.com/react/components/accordion)
 */
export function AccordionRoot(componentProps: AccordionRootProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled = false,
        hiddenUntilFound: hiddenUntilFoundProp,
        keepMounted: keepMountedProp,
        loopFocus = true,
        onValueChange: onValueChangeProp,
        multiple = false,
        orientation = 'vertical',
        value: valueProp,
        defaultValue: defaultValueProp,
        ref,
        ...elementProps
    } = componentProps;

    const direction = useDirection();

    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useIsoLayoutEffect(() => {
            if (hiddenUntilFoundProp && keepMountedProp === false) {
                warn(
                    'The `keepMounted={false}` prop on a Accordion.Root will be ignored when using `hiddenUntilFound` since it requires Panels to remain mounted when closed.'
                );
            }
        }, [hiddenUntilFoundProp, keepMountedProp]);
    }

    // memoized to allow omitting both defaultValue and value
    // which would otherwise trigger a warning in useControlled
    const defaultValue = React.useMemo(() => {
        if (valueProp === undefined) {
            return defaultValueProp ?? [];
        }

        return undefined;
    }, [valueProp, defaultValueProp]);

    const onValueChange = useStableCallback(onValueChangeProp);

    const accordionItemRefs = React.useRef<(HTMLElement | null)[]>([]);

    const [value, setValue] = useControlledState({
        prop: valueProp,
        defaultProp: defaultValue ?? EMPTY_ACCORDION_VALUE,
        caller: 'Accordion'
    });

    const handleValueChange = useStableCallback((newValue: number | string, nextOpen: boolean) => {
        const details = createChangeEventDetails(REASONS.none);
        if (!multiple) {
            const nextValue = value[0] === newValue ? [] : [newValue];
            onValueChange(nextValue, details);
            if (details.isCanceled) {
                return;
            }
            setValue(nextValue);
        }
        else if (nextOpen) {
            const nextOpenValues = value.slice();
            nextOpenValues.push(newValue);
            onValueChange(nextOpenValues, details);
            if (details.isCanceled) {
                return;
            }
            setValue(nextOpenValues);
        }
        else {
            const nextOpenValues = value.filter((v) => v !== newValue);
            onValueChange(nextOpenValues, details);
            if (details.isCanceled) {
                return;
            }
            setValue(nextOpenValues);
        }
    });

    const state: AccordionRoot.State = React.useMemo(
        () => ({
            value,
            disabled,
            orientation
        }),
        [value, disabled, orientation]
    );

    const contextValue: AccordionRootContextValue = React.useMemo(
        () => ({
            accordionItemRefs,
            direction,
            disabled,
            handleValueChange,
            hiddenUntilFound: hiddenUntilFoundProp ?? false,
            keepMounted: keepMountedProp ?? false,
            loopFocus,
            orientation,
            state,
            value
        }),
        [
            direction,
            disabled,
            handleValueChange,
            hiddenUntilFoundProp,
            keepMountedProp,
            loopFocus,
            orientation,
            state,
            value
        ]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: [{
            dir: direction,
            role: 'region'
        }, elementProps],
        customStyleHookMapping: rootStateAttributesMapping
    });

    return (
        <AccordionRootContext.Provider value={contextValue}>
            <CompositeList elementsRef={accordionItemRefs}>{element}</CompositeList>
        </AccordionRootContext.Provider>
    );
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

export type AccordionRootChangeEventDetails
    = HeadlessUIChangeEventDetails<AccordionRoot.ChangeEventReason>;

export namespace AccordionRoot {
    export type State = AccordionRootState;
    export type Props = AccordionRootProps;
    export type ChangeEventReason = AccordionRootChangeEventReason;
    export type ChangeEventDetails = AccordionRootChangeEventDetails;
}
