import React from 'react';

import {
    useEventCallback,
    useIsoLayoutEffect,
    useScrollLock,
    useStore
} from '@flippo-ui/hooks';
import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';

import { DROPDOWN_COLLISION_AVOIDANCE } from '~@lib/constants';
import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useAnchorPositioning, useRenderElement } from '~@lib/hooks';
import { InternalBackdrop } from '~@lib/InternalBackdrop';
import { findItemIndex, itemIncludes } from '~@lib/itemEquality';
import { popupStateMapping } from '~@lib/popupStateMapping';
import { REASONS } from '~@lib/reason';

import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { CompositeList } from '../../Composite/list/CompositeList';
import { useSelectFloatingContext, useSelectRootContext } from '../root/SelectRootContext';
import { selectors } from '../store';
import { clearStyles } from '../utils/clearStyles';

import { SelectPositionerContext } from './SelectPositionerContext';

import type { SelectPositionerContextValue } from './SelectPositionerContext';

const FIXED: React.CSSProperties = { position: 'fixed' };

/**
 * Positions the select popup.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectPositioner(componentProps: SelectPositioner.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        anchor,
        positionMethod = 'absolute',
        side = 'bottom',
        align = 'center',
        sideOffset = 0,
        alignOffset = 0,
        collisionBoundary = 'clipping-ancestors',
        collisionPadding,
        arrowPadding = 5,
        sticky = false,
        disableAnchorTracking,
        alignItemWithTrigger = true,
        collisionAvoidance = DROPDOWN_COLLISION_AVOIDANCE,
        ref,
        ...elementProps
    } = componentProps;

    const {
        store,
        listRef,
        labelsRef,
        alignItemWithTriggerActiveRef,
        selectedItemTextRef,
        valuesRef,
        initialValueRef,
        popupRef,
        setValue
    } = useSelectRootContext();
    const floatingRootContext = useSelectFloatingContext();

    const open = useStore(store, selectors.open);
    const mounted = useStore(store, selectors.mounted);
    const modal = useStore(store, selectors.modal);
    const value = useStore(store, selectors.value);
    const touchModality = useStore(store, selectors.touchModality);
    const positionerElement = useStore(store, selectors.positionerElement);
    const triggerElement = useStore(store, selectors.triggerElement);
    const isItemEqualToValue = useStore(store, selectors.isItemEqualToValue);

    const scrollUpArrowRef = React.useRef<HTMLDivElement | null>(null);
    const scrollDownArrowRef = React.useRef<HTMLDivElement | null>(null);

    const [controlledAlignItemWithTrigger, setControlledAlignItemWithTrigger]
        = React.useState(alignItemWithTrigger);
    const alignItemWithTriggerActive = mounted && controlledAlignItemWithTrigger && !touchModality;

    if (!mounted && controlledAlignItemWithTrigger !== alignItemWithTrigger) {
        setControlledAlignItemWithTrigger(alignItemWithTrigger);
    }

    useIsoLayoutEffect(() => {
        if (!mounted) {
            if (selectors.scrollUpArrowVisible(store.state)) {
                store.set('scrollUpArrowVisible', false);
            }
            if (selectors.scrollDownArrowVisible(store.state)) {
                store.set('scrollDownArrowVisible', false);
            }
        }
    }, [store, mounted]);

    React.useImperativeHandle(alignItemWithTriggerActiveRef, () => alignItemWithTriggerActive);

    useScrollLock((alignItemWithTriggerActive || modal) && open && !touchModality, triggerElement);

    const positioning = useAnchorPositioning({
        anchor,
        floatingRootContext,
        positionMethod,
        mounted,
        side,
        sideOffset,
        align,
        alignOffset,
        arrowPadding,
        collisionBoundary,
        collisionPadding,
        sticky,
        disableAnchorTracking: disableAnchorTracking ?? alignItemWithTriggerActive,
        collisionAvoidance,
        keepMounted: true
    });

    const renderedSide = alignItemWithTriggerActive ? 'none' : positioning.side;
    const positionerStyles = alignItemWithTriggerActive ? FIXED : positioning.positionerStyles;

    const defaultProps: React.ComponentProps<'div'> = React.useMemo(() => {
        const hiddenStyles: React.CSSProperties = {};

        if (!open) {
            hiddenStyles.pointerEvents = 'none';
        }

        return {
            role: 'presentation',
            hidden: !mounted,
            style: {
                ...positionerStyles,
                ...hiddenStyles
            }
        };
    }, [open, mounted, positionerStyles]);

    const state: SelectPositioner.State = React.useMemo(
        () => ({
            open,
            side: renderedSide,
            align: positioning.align,
            anchorHidden: positioning.anchorHidden
        }),
        [open, renderedSide, positioning.align, positioning.anchorHidden]
    );

    const setPositionerElement = useStableCallback((element) => {
        store.set('positionerElement', element);
    });

    const element = useRenderElement('div', componentProps, {
        ref: [ref, setPositionerElement],
        state,
        customStyleHookMapping: popupStateMapping,
        props: [defaultProps, elementProps]
    });

    const prevMapSizeRef = React.useRef(0);

    const onMapChange = useStableCallback((map: Map<Element, { index?: number | null } | null>) => {
        if (map.size === 0 && prevMapSizeRef.current === 0) {
            return;
        }

        if (valuesRef.current.length === 0) {
            return;
        }

        const prevSize = prevMapSizeRef.current;
        prevMapSizeRef.current = map.size;

        if (map.size === prevSize) {
            return;
        }

        const eventDetails = createChangeEventDetails(REASONS.none);

        if (prevSize !== 0 && !store.state.multiple && value !== null) {
            const valueIndex = findItemIndex(valuesRef.current, value, isItemEqualToValue);
            if (valueIndex === -1) {
                const initial = initialValueRef.current;
                const hasInitial
                    = initial != null && itemIncludes(valuesRef.current, initial, isItemEqualToValue);
                const nextValue = hasInitial ? initial : null;
                setValue(nextValue, eventDetails);

                if (nextValue === null) {
                    store.set('selectedIndex', null);
                    selectedItemTextRef.current = null;
                }
            }
        }

        if (prevSize !== 0 && store.state.multiple && Array.isArray(value)) {
            const nextValue = value.filter((v) => itemIncludes(valuesRef.current, v, isItemEqualToValue));
            if (
                nextValue.length !== value.length
                || nextValue.some((v) => !itemIncludes(value, v, isItemEqualToValue))
            ) {
                setValue(nextValue, eventDetails);

                if (nextValue.length === 0) {
                    store.set('selectedIndex', null);
                    selectedItemTextRef.current = null;
                }
            }
        }

        if (open && alignItemWithTriggerActive) {
            store.update({
                scrollUpArrowVisible: false,
                scrollDownArrowVisible: false
            });

            const stylesToClear: React.CSSProperties = { height: '' };
            clearStyles(positionerElement, stylesToClear);
            clearStyles(popupRef.current, stylesToClear);
        }
    });

    const contextValue: SelectPositionerContextValue = React.useMemo(
        () => ({
            ...positioning,
            side: renderedSide,
            alignItemWithTriggerActive,
            setControlledAlignItemWithTrigger,
            scrollUpArrowRef,
            scrollDownArrowRef
        }),
        [positioning, renderedSide, alignItemWithTriggerActive, setControlledAlignItemWithTrigger]
    );

    return (
        <CompositeList elementsRef={listRef} labelsRef={labelsRef} onMapChange={onMapChange}>
            <SelectPositionerContext.Provider value={contextValue}>
                {mounted && modal && <InternalBackdrop inert={!open} cutout={triggerElement} />}
                {element}
            </SelectPositionerContext.Provider>
        </CompositeList>
    );
}

export type SelectPositionerState = {
    open: boolean;
    side: Side | 'none';
    align: Align;
    anchorHidden: boolean;
};

export type SelectPositionerProps = {
    /**
     * Whether the positioner overlaps the trigger so the selected item's text is aligned with the trigger's value text.
     * This only applies to mouse input and is automatically disabled if there is not enough space.
     * @default true
     */
    alignItemWithTrigger?: boolean;
} & useAnchorPositioning.SharedParameters & HeadlessUIComponentProps<'div', SelectPositioner.State>;

export namespace SelectPositioner {
    export type State = SelectPositionerState;
    export type Props = SelectPositionerProps;
}
