import React from 'react';
import ReactDOM from 'react-dom';

import {
    useAnimationFrame,
    useIsoLayoutEffect,
    useOpenChangeComplete,
    useStore,
    useTimeout
} from '@flippo-ui/hooks';
import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';

import type { Interaction, TransitionStatus } from '@flippo-ui/hooks';

import { clamp } from '~@lib/clamp';
import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { isWebKit } from '~@lib/detectBrowser';
import { getDisabledMountTransitionStyles } from '~@lib/getDisabledMountTransitionStyles';
import { useRenderElement } from '~@lib/hooks';
import { isMouseWithinBounds } from '~@lib/isMouseWithinBounds';
import { ownerDocument, ownerWindow } from '~@lib/owner';
import { popupStateMapping } from '~@lib/popupStateMapping';
import { REASONS } from '~@lib/reason';
import { transitionStatusMapping } from '~@lib/styleHookMapping';
import { styleDisableScrollbar } from '~@lib/styles';
import { FloatingFocusManager } from '~@packages/floating-ui-react';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps, HTMLProps } from '~@lib/types';

import { COMPOSITE_KEYS } from '../../Composite/composite';
import { useCSPContext } from '../../CSPProvider/CSPContext';
import { useToolbarRootContext } from '../../Toolbar/root/ToolbarRootContext';
import { useSelectPositionerContext } from '../positioner/SelectPositionerContext';
import { useSelectFloatingContext, useSelectRootContext } from '../root/SelectRootContext';
import { selectors } from '../store';
import { clearStyles, LIST_FUNCTIONAL_STYLES } from '../utils/clearStyles';

import { getMaxPopupHeight, getMaxScrollTop, unsetTransformStyles } from './utils';

const SCROLL_EPS_PX = 1;

const customStyleHookMapping: StateAttributesMapping<SelectPopup.State> = {
    ...popupStateMapping,
    ...transitionStatusMapping
};

/**
 * A container for the select items.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectPopup(componentProps: SelectPopup.Props) {
    const { /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        finalFocus,
        ...elementProps
    } = componentProps;

    const {
        store,
        popupRef,
        onOpenChangeComplete,
        setOpen,
        valueRef,
        selectedItemTextRef,
        keyboardActiveRef,
        multiple,
        handleScrollArrowVisibility,
        scrollHandlerRef,
        highlightItemOnHover
    } = useSelectRootContext();
    const {
        side,
        align,
        alignItemWithTriggerActive,
        setControlledAlignItemWithTrigger,
        scrollDownArrowRef,
        scrollUpArrowRef
    } = useSelectPositionerContext();
    const insideToolbar = useToolbarRootContext(true) != null;
    const floatingRootContext = useSelectFloatingContext();

    const { nonce, disableStyleElements } = useCSPContext();

    const highlightTimeout = useTimeout();

    const id = useStore(store, selectors.id);
    const open = useStore(store, selectors.open);
    const mounted = useStore(store, selectors.mounted);
    const popupProps = useStore(store, selectors.popupProps);
    const transitionStatus = useStore(store, selectors.transitionStatus);
    const triggerElement = useStore(store, selectors.triggerElement);
    const positionerElement = useStore(store, selectors.positionerElement);
    const listElement = useStore(store, selectors.listElement);

    const initialHeightRef = React.useRef(0);
    const reachedMaxHeightRef = React.useRef(false);
    const maxHeightRef = React.useRef(0);
    const initialPlacedRef = React.useRef(false);
    const originalPositionerStylesRef = React.useRef<React.CSSProperties>({});

    const scrollArrowFrame = useAnimationFrame();

    const handleScroll = useStableCallback((scroller: HTMLDivElement) => {
        if (!positionerElement || !popupRef.current || !initialPlacedRef.current) {
            return;
        }

        if (reachedMaxHeightRef.current || !alignItemWithTriggerActive) {
            handleScrollArrowVisibility();
            return;
        }

        const isTopPositioned = positionerElement.style.top === '0px';
        const isBottomPositioned = positionerElement.style.bottom === '0px';

        const currentHeight = positionerElement.getBoundingClientRect().height;
        const doc = ownerDocument(positionerElement);
        const positionerStyles = getComputedStyle(positionerElement);
        const marginTop = Number.parseFloat(positionerStyles.marginTop);
        const marginBottom = Number.parseFloat(positionerStyles.marginBottom);
        const maxPopupHeight = getMaxPopupHeight(getComputedStyle(popupRef.current));
        const maxAvailableHeight = Math.min(
            doc.documentElement.clientHeight - marginTop - marginBottom,
            maxPopupHeight
        );

        const scrollTop = scroller.scrollTop;
        const maxScrollTop = getMaxScrollTop(scroller);

        let nextPositionerHeight = 0;
        let nextScrollTop: number | null = null;
        let setReachedMax = false;
        let scrollToMax = false;

        const setHeight = (height: number) => {
            positionerElement.style.height = `${height}px`;
        };

        const handleSmallDiff = (diff: number, targetScrollTop: number) => {
            const heightDelta = clamp(diff, 0, maxAvailableHeight - currentHeight);
            if (heightDelta > 0) {
                // Consume the remaining scroll in height.
                setHeight(currentHeight + heightDelta);
            }
            scroller.scrollTop = targetScrollTop;
            if (maxAvailableHeight - (currentHeight + heightDelta) <= SCROLL_EPS_PX) {
                reachedMaxHeightRef.current = true;
            }
            handleScrollArrowVisibility();
        };

        if (isTopPositioned) {
            const diff = maxScrollTop - scrollTop;
            const idealHeight = currentHeight + diff;
            const nextHeight = Math.min(idealHeight, maxAvailableHeight);

            nextPositionerHeight = nextHeight;

            if (diff <= SCROLL_EPS_PX) {
                handleSmallDiff(diff, maxScrollTop);
                return;
            }

            if (maxAvailableHeight - nextHeight > SCROLL_EPS_PX) {
                scrollToMax = true;
            }
            else {
                setReachedMax = true;
            }
        }
        else if (isBottomPositioned) {
            const diff = scrollTop;
            const idealHeight = currentHeight + diff;
            const nextHeight = Math.min(idealHeight, maxAvailableHeight);
            const overshoot = idealHeight - maxAvailableHeight;

            nextPositionerHeight = nextHeight;

            if (diff <= SCROLL_EPS_PX) {
                handleSmallDiff(diff, 0);
                return;
            }

            if (maxAvailableHeight - nextHeight > SCROLL_EPS_PX) {
                nextScrollTop = 0;
            }
            else {
                setReachedMax = true;

                if (scrollTop < maxScrollTop) {
                    nextScrollTop = scrollTop - (diff - overshoot);
                }
            }
        }

        nextPositionerHeight = Math.ceil(nextPositionerHeight);

        if (nextPositionerHeight !== 0) {
            setHeight(nextPositionerHeight);
        }

        if (scrollToMax || nextScrollTop != null) {
            // Recompute bounds after resizing (clientHeight likely changed).
            const nextMaxScrollTop = getMaxScrollTop(scroller);

            const target = scrollToMax ? nextMaxScrollTop : clamp(nextScrollTop!, 0, nextMaxScrollTop);

            // Avoid adjustments that re-trigger scroll events forever.
            if (Math.abs(scroller.scrollTop - target) > SCROLL_EPS_PX) {
                scroller.scrollTop = target;
            }
        }

        if (setReachedMax || nextPositionerHeight >= maxAvailableHeight - SCROLL_EPS_PX) {
            reachedMaxHeightRef.current = true;
        }

        handleScrollArrowVisibility();
    });

    React.useImperativeHandle(scrollHandlerRef, () => handleScroll, [handleScroll]);

    useOpenChangeComplete({
        open,
        ref: popupRef,
        onComplete() {
            if (open) {
                onOpenChangeComplete?.(true);
            }
        }
    });

    const state: SelectPopup.State = {
        open,
        transitionStatus,
        side,
        align
    };

    useIsoLayoutEffect(() => {
        if (
            !positionerElement
            || !popupRef.current
            || Object.keys(originalPositionerStylesRef.current).length
        ) {
            return;
        }

        originalPositionerStylesRef.current = {
            top: positionerElement.style.top || '0',
            left: positionerElement.style.left || '0',
            right: positionerElement.style.right,
            height: positionerElement.style.height,
            bottom: positionerElement.style.bottom,
            minHeight: positionerElement.style.minHeight,
            maxHeight: positionerElement.style.maxHeight,
            marginTop: positionerElement.style.marginTop,
            marginBottom: positionerElement.style.marginBottom
        };
    }, [popupRef, positionerElement]);

    useIsoLayoutEffect(() => {
        if (open || alignItemWithTriggerActive) {
            return;
        }

        initialPlacedRef.current = false;
        reachedMaxHeightRef.current = false;
        initialHeightRef.current = 0;
        maxHeightRef.current = 0;

        clearStyles(positionerElement, originalPositionerStylesRef.current);
    }, [open, alignItemWithTriggerActive, positionerElement, popupRef]);

    useIsoLayoutEffect(() => {
        const popupElement = popupRef.current;

        if (
            !open
            || !triggerElement
            || !positionerElement
            || !popupElement
            || store.state.transitionStatus === 'ending'
        ) {
            return;
        }

        if (!alignItemWithTriggerActive) {
            initialPlacedRef.current = true;
            scrollArrowFrame.request(handleScrollArrowVisibility);
            popupElement.style.removeProperty('--transform-origin');
            return;
        }

        // Wait for `selectedItemTextRef.current` to be set.
        queueMicrotask(() => {
            // Ensure we remove any transforms that can affect the location of the popup
            // and therefore the calculations.
            const restoreTransformStyles = unsetTransformStyles(popupElement);
            popupElement.style.removeProperty('--transform-origin');

            try {
                const positionerStyles = getComputedStyle(positionerElement);
                const popupStyles = getComputedStyle(popupElement);

                const doc = ownerDocument(triggerElement);
                const win = ownerWindow(positionerElement);
                const triggerRect = triggerElement.getBoundingClientRect();
                const positionerRect = positionerElement.getBoundingClientRect();
                const triggerX = triggerRect.left;
                const triggerHeight = triggerRect.height;
                const scroller = listElement || popupElement;
                const scrollHeight = scroller.scrollHeight;

                const borderBottom = Number.parseFloat(popupStyles.borderBottomWidth);
                const marginTop = Number.parseFloat(positionerStyles.marginTop) || 10;
                const marginBottom = Number.parseFloat(positionerStyles.marginBottom) || 10;
                const minHeight = Number.parseFloat(positionerStyles.minHeight) || 100;
                const maxPopupHeight = getMaxPopupHeight(popupStyles);

                const paddingLeft = 5;
                const paddingRight = 5;
                const triggerCollisionThreshold = 20;

                const viewportHeight = doc.documentElement.clientHeight - marginTop - marginBottom;
                const viewportWidth = doc.documentElement.clientWidth;
                const availableSpaceBeneathTrigger = viewportHeight - triggerRect.bottom + triggerHeight;

                const textElement = selectedItemTextRef.current;
                const valueElement = valueRef.current;

                let textRect: DOMRect | undefined;
                let offsetX = 0;
                let offsetY = 0;

                if (textElement && valueElement) {
                    const valueRect = valueElement.getBoundingClientRect();
                    textRect = textElement.getBoundingClientRect();

                    const valueLeftFromTriggerLeft = valueRect.left - triggerX;
                    const textLeftFromPositionerLeft = textRect.left - positionerRect.left;
                    const valueCenterFromPositionerTop
                        = valueRect.top - triggerRect.top + valueRect.height / 2;
                    const textCenterFromTriggerTop = textRect.top - positionerRect.top + textRect.height / 2;

                    offsetX = valueLeftFromTriggerLeft - textLeftFromPositionerLeft;
                    offsetY = textCenterFromTriggerTop - valueCenterFromPositionerTop;
                }

                const idealHeight = availableSpaceBeneathTrigger + offsetY + marginBottom + borderBottom;
                let height = Math.min(viewportHeight, idealHeight);
                const maxHeight = viewportHeight - marginTop - marginBottom;
                const scrollTop = idealHeight - height;

                const left = Math.max(paddingLeft, triggerX + offsetX);
                const maxRight = viewportWidth - paddingRight;
                const rightOverflow = Math.max(0, left + positionerRect.width - maxRight);

                positionerElement.style.left = `${left - rightOverflow}px`;
                positionerElement.style.height = `${height}px`;
                positionerElement.style.maxHeight = 'auto';
                positionerElement.style.marginTop = `${marginTop}px`;
                positionerElement.style.marginBottom = `${marginBottom}px`;
                popupElement.style.height = '100%';

                const maxScrollTop = scroller.scrollHeight - scroller.clientHeight;
                const isTopPositioned = scrollTop >= maxScrollTop;

                if (isTopPositioned) {
                    height = Math.min(viewportHeight, positionerRect.height) - (scrollTop - maxScrollTop);
                }

                // When the trigger is too close to the top or bottom of the viewport, or the minHeight is
                // reached, we fallback to aligning the popup to the trigger as the UX is poor otherwise.
                const fallbackToAlignPopupToTrigger
                    = triggerRect.top < triggerCollisionThreshold
                      || triggerRect.bottom > viewportHeight - triggerCollisionThreshold
                      || height < Math.min(scrollHeight, minHeight);

                // Safari doesn't position the popup correctly when pinch-zoomed.
                const isPinchZoomed = (win.visualViewport?.scale ?? 1) !== 1 && isWebKit;

                if (fallbackToAlignPopupToTrigger || isPinchZoomed) {
                    initialPlacedRef.current = true;
                    clearStyles(positionerElement, originalPositionerStylesRef.current);
                    ReactDOM.flushSync(() => setControlledAlignItemWithTrigger(false));
                    return;
                }

                if (isTopPositioned) {
                    const topOffset = Math.max(0, viewportHeight - idealHeight);
                    positionerElement.style.top = positionerRect.height >= maxHeight ? '0' : `${topOffset}px`;
                    positionerElement.style.height = `${height}px`;
                    scroller.scrollTop = scroller.scrollHeight - scroller.clientHeight;
                    initialHeightRef.current = Math.max(minHeight, height);
                }
                else {
                    positionerElement.style.bottom = '0';
                    initialHeightRef.current = Math.max(minHeight, height);
                    scroller.scrollTop = scrollTop;
                }

                if (textRect) {
                    const popupTop = positionerRect.top;
                    const popupHeight = positionerRect.height;
                    const textCenterY = textRect.top + textRect.height / 2;

                    const transformOriginY
                        = popupHeight > 0 ? ((textCenterY - popupTop) / popupHeight) * 100 : 50;

                    const clampedY = clamp(transformOriginY, 0, 100);

                    popupElement.style.setProperty('--transform-origin', `50% ${clampedY}%`);
                }

                if (initialHeightRef.current === viewportHeight || height >= maxPopupHeight) {
                    reachedMaxHeightRef.current = true;
                }

                handleScrollArrowVisibility();

                // Avoid the `onScroll` event logic from triggering before the popup is placed.
                setTimeout(() => {
                    initialPlacedRef.current = true;
                });
            }
            finally {
                restoreTransformStyles();
            }
        });
    }, [
        store,
        open,
        positionerElement,
        triggerElement,
        valueRef,
        selectedItemTextRef,
        popupRef,
        handleScrollArrowVisibility,
        alignItemWithTriggerActive,
        setControlledAlignItemWithTrigger,
        scrollArrowFrame,
        scrollDownArrowRef,
        scrollUpArrowRef,
        listElement
    ]);

    React.useEffect(() => {
        if (!alignItemWithTriggerActive || !positionerElement || !open) {
            return undefined;
        }

        const win = ownerWindow(positionerElement);

        function handleResize(event: UIEvent) {
            setOpen(false, createChangeEventDetails(REASONS.windowResize, event));
        }

        win.addEventListener('resize', handleResize);

        return () => {
            win.removeEventListener('resize', handleResize);
        };
    }, [setOpen, alignItemWithTriggerActive, positionerElement, open]);

    const defaultProps: HTMLProps = {
        ...(listElement
            ? {
                'role': 'presentation',
                'aria-orientation': undefined
            }
            : {
                'role': 'listbox',
                'aria-multiselectable': multiple || undefined,
                'id': `${id}-list`
            }),
        onKeyDown(event) {
            keyboardActiveRef.current = true;
            if (insideToolbar && COMPOSITE_KEYS.has(event.key)) {
                event.stopPropagation();
            }
        },
        onMouseMove() {
            keyboardActiveRef.current = false;
        },
        onPointerLeave(event) {
            if (!highlightItemOnHover || isMouseWithinBounds(event) || event.pointerType === 'touch') {
                return;
            }

            const popup = event.currentTarget;

            highlightTimeout.start(0, () => {
                store.set('activeIndex', null);
                popup.focus({ preventScroll: true });
            });
        },
        onScroll(event) {
            if (listElement) {
                return;
            }
            handleScroll(event.currentTarget);
        },
        ...(alignItemWithTriggerActive && {
            style: listElement ? { height: '100%' } : LIST_FUNCTIONAL_STYLES
        })
    };

    const element = useRenderElement('div', componentProps, {
        ref: [ref, popupRef],
        state,
        customStyleHookMapping,
        props: [
            popupProps,
            defaultProps,
            getDisabledMountTransitionStyles(transitionStatus),
            {
                className:
                    !listElement && alignItemWithTriggerActive ? styleDisableScrollbar.className : undefined
            },
            elementProps
        ]
    });

    return (
        <React.Fragment>
            {!disableStyleElements && styleDisableScrollbar.getElement(nonce)}
            <FloatingFocusManager
                context={floatingRootContext}
                modal={false}
                disabled={!mounted}
                returnFocus={finalFocus}
                restoreFocus
            >
                {element}
            </FloatingFocusManager>
        </React.Fragment>
    );
}

export type SelectPopupProps = {
    children?: React.ReactNode;
    /**
     * Determines the element to focus when the select popup is closed.
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
      | ((closeType: Interaction) => boolean | HTMLElement | null | void)
      | undefined;
} & HeadlessUIComponentProps<'div', SelectPopup.State>;

export type SelectPopupState = {
    side: Side | 'none';
    align: Align;
    open: boolean;
    transitionStatus: TransitionStatus;
};

export namespace SelectPopup {
    export type Props = SelectPopupProps;
    export type State = SelectPopupState;
}
