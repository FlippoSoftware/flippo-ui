import React from 'react';

import { useOpenChangeComplete } from '@flippo-ui/hooks/use-open-change-complete';
import { isHTMLElement } from '@floating-ui/utils/dom';

import type { Interaction } from '@flippo-ui/hooks/use-enhanced-click-handler';
import type { TransitionStatus } from '@flippo-ui/hooks/use-transition-status';

import { EMPTY_OBJECT } from '~@lib/constants';
import { getDisabledMountTransitionStyles } from '~@lib/getDisabledMountTransitionStyles';
import { useDirection, usePopupAutoResize, useRenderElement } from '~@lib/hooks';
import { popupStateMapping as baseMapping } from '~@lib/popupStateMapping';
import { REASONS } from '~@lib/reason';
import { transitionStatusMapping } from '~@lib/styleHookMapping';
import {
    FloatingFocusManager,
    useHoverFloatingInteraction
} from '~@packages/floating-ui-react';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';
import type { Dimensions } from '~@packages/floating-ui-react';

import { COMPOSITE_KEYS } from '../../Composite/composite';
import { useToolbarRootContext } from '../../Toolbar/root/ToolbarRootContext';
import { usePopoverPositionerContext } from '../positioner/PopoverPositionerContext';
import { usePopoverRootContext } from '../root/PopoverRootContext';

const stateAttributesMapping: StateAttributesMapping<PopoverPopup.State> = {
    ...baseMapping,
    ...transitionStatusMapping
};

/**
 * A container for the popover contents.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Popover](https://base-ui.com/react/components/popover)
 */
export function PopoverPopup(componentProps: PopoverPopup.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        initialFocus,
        finalFocus,
        ...elementProps
    } = componentProps;

    const { store } = usePopoverRootContext();

    const positioner = usePopoverPositionerContext();
    const insideToolbar = useToolbarRootContext(true) != null;
    const direction = useDirection();

    const open = store.useState('open');
    const openMethod = store.useState('openMethod');
    const instantType = store.useState('instantType');
    const transitionStatus = store.useState('transitionStatus');
    const popupProps = store.useState('popupProps');
    const titleId = store.useState('titleElementId');
    const descriptionId = store.useState('descriptionElementId');
    const modal = store.useState('modal');
    const mounted = store.useState('mounted');
    const openReason = store.useState('openChangeReason');
    const popupElement = store.useState('popupElement');
    const payload = store.useState('payload');
    const positionerElement = store.useState('positionerElement');
    const activeTriggerElement = store.useState('activeTriggerElement');
    const floatingContext = store.useState('floatingRootContext');

    useOpenChangeComplete({
        open,
        ref: store.context.popupRef,
        onComplete() {
            if (open) {
                store.context.onOpenChangeComplete?.(true);
            }
        }
    });

    const disabled = store.useState('disabled');
    const openOnHover = store.useState('openOnHover');
    const closeDelay = store.useState('closeDelay');

    useHoverFloatingInteraction(floatingContext, { enabled: openOnHover && !disabled, closeDelay });

    // Default initial focus logic:
    // If opened by touch, focus the popup element to prevent the virtual keyboard from opening
    // (this is required for Android specifically as iOS handles this automatically).
    function defaultInitialFocus(interactionType: Interaction) {
        if (interactionType === 'touch') {
            return store.context.popupRef.current;
        }
        return true;
    }

    const resolvedInitialFocus = initialFocus === undefined ? defaultInitialFocus : initialFocus;

    const state: PopoverPopup.State = React.useMemo(
        () => ({
            open,
            side: positioner.side,
            align: positioner.align,
            instant: instantType,
            transitionStatus
        }),
        [
            open,
            positioner.side,
            positioner.align,
            instantType,
            transitionStatus
        ]
    );

    const setPopupElement = React.useCallback(
        (element: HTMLElement | null) => {
            store.set('popupElement', element);
        },
        [store]
    );

    function handleMeasureLayout() {
        floatingContext.context.events.emit('measure-layout');
    }

    function handleMeasureLayoutComplete(
        previousDimensions: Dimensions | null,
        nextDimensions: Dimensions
    ) {
        floatingContext.context.events.emit('measure-layout-complete', {
            previousDimensions,
            nextDimensions
        });
    }

    // If there's just one trigger, we can skip the auto-resize logic as
    // the popover will always be anchored to the same position.
    const autoresizeEnabled = () => store.context.triggerElements.size > 1;

    usePopupAutoResize({
        popupElement,
        positionerElement,
        mounted,
        content: payload,
        enabled: autoresizeEnabled,
        onMeasureLayout: handleMeasureLayout,
        onMeasureLayoutComplete: handleMeasureLayoutComplete
    });

    const anchoringStyles: React.CSSProperties = React.useMemo(() => {
    // Ensure popup size transitions correctly when anchored to `bottom` (side=top) or `right` (side=left).
        let isOriginSide = positioner.side === 'top';
        let isPhysicalLeft = positioner.side === 'left';
        if (direction === 'rtl') {
            isOriginSide = isOriginSide || positioner.side === 'inline-end';
            isPhysicalLeft = isPhysicalLeft || positioner.side === 'inline-end';
        }
        else {
            isOriginSide = isOriginSide || positioner.side === 'inline-start';
            isPhysicalLeft = isPhysicalLeft || positioner.side === 'inline-start';
        }

        return isOriginSide
            ? {
                position: 'absolute',
                [positioner.side === 'top' ? 'bottom' : 'top']: '0',
                [isPhysicalLeft ? 'right' : 'left']: '0'
            }
            : EMPTY_OBJECT;
    }, [positioner.side, direction]);

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, store.context.popupRef, setPopupElement],
        props: [popupProps, {
            'aria-labelledby': titleId,
            'aria-describedby': descriptionId,
            'style': anchoringStyles,
            onKeyDown(event) {
                if (insideToolbar && COMPOSITE_KEYS.has(event.key)) {
                    event.stopPropagation();
                }
            }
        }, getDisabledMountTransitionStyles(transitionStatus), elementProps],
        customStyleHookMapping: stateAttributesMapping
    });

    return (
        <FloatingFocusManager
          context={floatingContext}
          openInteractionType={openMethod}
          modal={modal === 'trap-focus'}
          disabled={!mounted || openReason === REASONS.triggerHover}
          initialFocus={resolvedInitialFocus}
          returnFocus={finalFocus}
          restoreFocus={'popup'}
          previousFocusableElement={
                isHTMLElement(activeTriggerElement) ? activeTriggerElement : undefined
            }
          nextFocusableElement={store.context.triggerFocusTargetRef}
          beforeContentFocusGuardRef={store.context.beforeContentFocusGuardRef}
        >
            {element}
        </FloatingFocusManager>
    );
}

export type PopoverPopupState = {
    /**
     * Whether the popover is currently open.
     */
    open: boolean;
    side: Side;
    align: Align;
    transitionStatus: TransitionStatus;
};

export type PopoverPopupProps = {
    /**
     * Determines the element to focus when the popover is opened.
     *
     * - `false`: Do not move focus.
     * - `true`: Move focus based on the default behavior (first tabbable element or popup).
     * - `RefObject`: Move focus to the ref element.
     * - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`).
     *   Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
     */
    initialFocus?:
      | boolean
      | React.RefObject<HTMLElement | null>
      | ((openType: Interaction) => void | boolean | HTMLElement | null);
    /**
     * Determines the element to focus when the popover is closed.
     *
     * - `false`: Do not move focus.
     * - `true`: Move focus based on the default behavior (trigger or previously focused element).
     * - `RefObject`: Move focus to the ref element.
     * - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`).
     *   Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
     */
    finalFocus?:
      | boolean
      | React.RefObject<HTMLElement | null>
      | ((closeType: Interaction) => void | boolean | HTMLElement | null);
} & HeadlessUIComponentProps<'div', PopoverPopup.State>;

export namespace PopoverPopup {
    export type State = PopoverPopupState;
    export type Props = PopoverPopupProps;
}
