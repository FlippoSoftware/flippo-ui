'use client';

import React from 'react';

import {
    useEventCallback,
    useIsoLayoutEffect,
    useScrollLock,
    useStore
} from '@flippo-ui/hooks';

import { DROPDOWN_COLLISION_AVOIDANCE } from '@lib/constants';
import { useAnchorPositioning, useRenderElement } from '@lib/hooks';
import { InternalBackdrop } from '@lib/InternalBackdrop';
import { popupStateMapping } from '@lib/popupStateMapping';

import type { TAlign, TSide, UseAnchorPositioning } from '@lib/hooks';
import type { HeadlessUIComponentProps } from '@lib/types';

import { CompositeList } from '../../Composite/list/CompositeList';
import { useSelectFloatingContext, useSelectRootContext } from '../root/SelectRootContext';
import { selectors } from '../store';
import { clearPositionerStyles } from '../utils/clearPositionerStyles';

import { SelectPositionerContext } from './SelectPositionerContext';

import type { TSelectPositionerContext } from './SelectPositionerContext';

const FIXED: React.CSSProperties = { position: 'fixed' };

/**
 * Positions the select menu popup.
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
        trackAnchor = true,
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
        valuesRef
    }
        = useSelectRootContext();
    const floatingRootContext = useSelectFloatingContext();

    const open = useStore(store, selectors.open);
    const mounted = useStore(store, selectors.mounted);
    const modal = useStore(store, selectors.modal);
    const value = useStore(store, selectors.value);
    const touchModality = useStore(store, selectors.touchModality);
    const positionerElement = useStore(store, selectors.positionerElement);
    const triggerElement = useStore(store, selectors.triggerElement);

    const [controlledAlignItemWithTrigger, setControlledAlignItemWithTrigger]
        = React.useState(alignItemWithTrigger);
    const alignItemWithTriggerActive = mounted && controlledAlignItemWithTrigger && !touchModality;

    if (!mounted && controlledAlignItemWithTrigger !== alignItemWithTrigger) {
        setControlledAlignItemWithTrigger(alignItemWithTrigger);
    }

    useIsoLayoutEffect(() => {
        if (!alignItemWithTrigger || !mounted) {
            if (selectors.scrollUpArrowVisible(store.state)) {
                store.set('scrollUpArrowVisible', false);
            }
            if (selectors.scrollDownArrowVisible(store.state)) {
                store.set('scrollDownArrowVisible', false);
            }
        }
    }, [store, mounted, alignItemWithTrigger]);

    React.useImperativeHandle(alignItemWithTriggerActiveRef, () => alignItemWithTriggerActive);

    useScrollLock({
        enabled: (alignItemWithTriggerActive || modal) && open && !touchModality,
        mounted,
        open,
        referenceElement: triggerElement
    });

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
        trackAnchor: trackAnchor ?? !alignItemWithTriggerActive,
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
        [
            open,
            renderedSide,
            positioning.align,
            positioning.anchorHidden
        ]
    );

    const setPositionerElement = useEventCallback((element) => {
        store.set('positionerElement', element);
    });

    const element = useRenderElement('div', componentProps, {
        ref: [ref, setPositionerElement],
        state,
        customStyleHookMapping: popupStateMapping,
        props: [defaultProps, elementProps]
    });

    const prevMapSizeRef = React.useRef(0);

    const onMapChange = useEventCallback((map: Map<Element, { index?: number | null } | null>) => {
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

        if (!store.state.multiple && value !== null) {
            const valueIndex = valuesRef.current.indexOf(value);
            if (valueIndex === -1) {
                store.apply({
                    label: '',
                    selectedIndex: null
                });
            }
        }

        if (open && alignItemWithTriggerActive) {
            store.apply({
                scrollUpArrowVisible: false,
                scrollDownArrowVisible: false
            });

            if (positionerElement) {
                clearPositionerStyles(positionerElement, { height: '' });
            }
        }
    });

    const contextValue: TSelectPositionerContext = React.useMemo(
        () => ({
            ...positioning,
            side: renderedSide,
            alignItemWithTriggerActive,
            setControlledAlignItemWithTrigger
        }),
        [
            positioning,
            renderedSide,
            alignItemWithTriggerActive,
            setControlledAlignItemWithTrigger
        ]
    );

    return (
        <CompositeList elementsRef={listRef} labelsRef={labelsRef} onMapChange={onMapChange}>
            <SelectPositionerContext value={contextValue}>
                {mounted && modal && <InternalBackdrop inert={!open} cutout={triggerElement} />}
                {element}
            </SelectPositionerContext>
        </CompositeList>
    );
}

export namespace SelectPositioner {
    export type State = {
        open: boolean;
        side: TSide | 'none';
        align: TAlign;
        anchorHidden: boolean;
    };

    export type Props = {
        /**
         * Whether the positioner overlaps the trigger so the selected item's text is aligned with the trigger's value text.
         * This only applies to mouse input and is automatically disabled if there is not enough space.
         * @default true
         */
        alignItemWithTrigger?: boolean;
    } & UseAnchorPositioning.SharedParameters & HeadlessUIComponentProps<'div', State>;
}
