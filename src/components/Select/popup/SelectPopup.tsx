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

import type { TransitionStatus } from '@flippo-ui/hooks';

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
import { useToolbarRootContext } from '../../Toolbar/root/ToolbarRootContext';
import { useSelectPositionerContext } from '../positioner/SelectPositionerContext';
import { useSelectFloatingContext, useSelectRootContext } from '../root/SelectRootContext';
import { selectors } from '../store';
import { clearStyles, LIST_FUNCTIONAL_STYLES } from '../utils/clearStyles';

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
        scrollHandlerRef
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
        const viewportHeight = doc.documentElement.clientHeight - marginTop - marginBottom;

        const scrollTop = scroller.scrollTop;
        const scrollHeight = scroller.scrollHeight;
        const clientHeight = scroller.clientHeight;
        const maxScrollTop = scrollHeight - clientHeight;

        let nextPositionerHeight: number | null = null;
        let nextScrollTop: number | null = null;
        let setReachedMax = false;

        if (isTopPositioned) {
            const diff = maxScrollTop - scrollTop;
            const idealHeight = currentHeight + diff;
            const nextHeight = Math.min(idealHeight, viewportHeight);

            nextPositionerHeight = nextHeight;

            if (nextHeight !== viewportHeight) {
                nextScrollTop = maxScrollTop;
            }
            else {
                setReachedMax = true;
            }
        }
        else if (isBottomPositioned) {
            const diff = scrollTop - 0;
            const idealHeight = currentHeight + diff;
            const nextHeight = Math.min(idealHeight, viewportHeight);
            const overshoot = idealHeight - viewportHeight;

            nextPositionerHeight = nextHeight;

            if (nextHeight !== viewportHeight) {
                nextScrollTop = 0;
            }
            else {
                setReachedMax = true;

                if (scrollTop < maxScrollTop) {
                    nextScrollTop = scrollTop - (diff - overshoot);
                }
            }
        }

        if (nextPositionerHeight != null) {
            positionerElement.style.height = `${nextPositionerHeight}px`;
        }
        if (nextScrollTop != null) {
            scroller.scrollTop = nextScrollTop;
        }
        if (setReachedMax) {
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

    const state: SelectPopup.State = React.useMemo(
        () => ({
            open,
            transitionStatus,
            side,
            align
        }),
        [open, transitionStatus, side, align]
    );

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
        if (mounted || alignItemWithTriggerActive) {
            return;
        }

        initialPlacedRef.current = false;
        reachedMaxHeightRef.current = false;
        initialHeightRef.current = 0;
        maxHeightRef.current = 0;

        clearStyles(positionerElement, originalPositionerStylesRef.current);
    }, [mounted, alignItemWithTriggerActive, positionerElement, popupRef]);

    useIsoLayoutEffect(() => {
        const popupElement = popupRef.current;

        if (!mounted || !triggerElement || !positionerElement || !popupElement) {
            return;
        }

        if (!alignItemWithTriggerActive) {
            initialPlacedRef.current = true;
            scrollArrowFrame.request(handleScrollArrowVisibility);
            return;
        }

        // Wait for `selectedItemTextRef.current` to be set.
        queueMicrotask(() => {
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

            const paddingLeft = 5;
            const paddingRight = 5;
            const triggerCollisionThreshold = 20;

            const viewportHeight = doc.documentElement.clientHeight - marginTop - marginBottom;
            const viewportWidth = doc.documentElement.clientWidth;
            const availableSpaceBeneathTrigger = viewportHeight - triggerRect.bottom + triggerHeight;

            const textElement = selectedItemTextRef.current;
            const valueElement = valueRef.current;
            let offsetX = 0;
            let offsetY = 0;

            if (textElement && valueElement) {
                const valueRect = valueElement.getBoundingClientRect();
                const textRect = textElement.getBoundingClientRect();
                const valueLeftFromTriggerLeft = valueRect.left - triggerX;
                const textLeftFromPositionerLeft = textRect.left - positionerRect.left;
                const valueCenterFromPositionerTop = valueRect.top - triggerRect.top + valueRect.height / 2;
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

            if (initialHeightRef.current === viewportHeight) {
                reachedMaxHeightRef.current = true;
            }

            handleScrollArrowVisibility();

            // Avoid the `onScroll` event logic from triggering before the popup is placed.
            setTimeout(() => {
                initialPlacedRef.current = true;
            });
        });
    }, [
        store,
        mounted,
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
        if (!alignItemWithTriggerActive || !positionerElement || !mounted) {
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
    }, [setOpen, alignItemWithTriggerActive, positionerElement, mounted]);

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
            if (isMouseWithinBounds(event) || event.pointerType === 'touch') {
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
            scrollHandlerRef.current?.(event.currentTarget);
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
            {styleDisableScrollbar.element}
            <FloatingFocusManager
                context={floatingRootContext}
                modal={false}
                disabled={!mounted}
                restoreFocus
            >
                {element}
            </FloatingFocusManager>
        </React.Fragment>
    );
}

export type SelectPopupProps = {
    children?: React.ReactNode;
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
