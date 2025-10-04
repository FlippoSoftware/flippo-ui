import React from 'react';
import ReactDOM from 'react-dom';

import {
    useAnimationFrame,
    useEventCallback,
    useIsoLayoutEffect,
    useOpenChangeComplete,
    useStore,
    useTimeout
} from '@flippo-ui/hooks';
import { DISABLED_TRANSITIONS_STYLE } from '@lib/constants';
import { createChangeEventDetails } from '@lib/createHeadlessUIEventDetails';
import { isWebKit } from '@lib/detectBrowser';
import { useRenderElement } from '@lib/hooks';
import { isMouseWithinBounds } from '@lib/isMouseWithinBounds';
import { ownerDocument, ownerWindow } from '@lib/owner';
import { popupStateMapping } from '@lib/popupStateMapping';
import { transitionStatusMapping } from '@lib/styleHookMapping';
import { styleDisableScrollbar } from '@lib/styles';
import { FloatingFocusManager } from '@packages/floating-ui-react';

import type { TransitionStatus } from '@flippo-ui/hooks';
import type { StateAttributesMapping } from '@lib/getStyleHookProps';
import type { TAlign, TSide } from '@lib/hooks';
import type { HeadlessUIComponentProps, HTMLProps } from '@lib/types';

import { COMPOSITE_KEYS } from '../../Composite/composite';
import { useToolbarRootContext } from '../../Toolbar/root/ToolbarRootContext';
import { useSelectPositionerContext } from '../positioner/SelectPositionerContext';
import { useSelectRootContext } from '../root/SelectRootContext';
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
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
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
        context,
        alignItemWithTriggerActive,
        setControlledAlignItemWithTrigger,
        scrollDownArrowRef,
        scrollUpArrowRef
    } = useSelectPositionerContext();
    const insideToolbar = useToolbarRootContext(true) != null;

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

    const handleScroll = useEventCallback((scroller: HTMLDivElement) => {
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

        if (isTopPositioned) {
            const scrollTop = scroller.scrollTop;
            const maxScrollTop = scroller.scrollHeight - scroller.clientHeight;
            const diff = maxScrollTop - scrollTop;
            const nextHeight = Math.min(currentHeight + diff, viewportHeight);
            positionerElement.style.height = `${Math.min(currentHeight + diff, viewportHeight)}px`;

            if (nextHeight !== viewportHeight) {
                scroller.scrollTop = maxScrollTop;
            }
            else {
                reachedMaxHeightRef.current = true;
            }
        }
        else if (isBottomPositioned) {
            const scrollTop = scroller.scrollTop;
            const minScrollTop = 0;
            const diff = scrollTop - minScrollTop;
            const nextHeight = Math.min(currentHeight + diff, viewportHeight);
            const idealHeight = currentHeight + diff;
            const overshoot = idealHeight - viewportHeight;
            positionerElement.style.height = `${Math.min(idealHeight, viewportHeight)}px`;

            if (nextHeight !== viewportHeight) {
                scroller.scrollTop = 0;
            }
            else {
                reachedMaxHeightRef.current = true;
                if (scroller.scrollTop < scroller.scrollHeight - scroller.clientHeight) {
                    scroller.scrollTop -= diff - overshoot;
                }
            }
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
        [
            open,
            transitionStatus,
            side,
            align
        ]
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
    }, [
        mounted,
        alignItemWithTriggerActive,
        positionerElement,
        popupRef
    ]);

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
            // eslint-disable-next-line react-web-api/no-leaked-timeout
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

        function handleResize(event: Event) {
            setOpen(false, createChangeEventDetails('window-resize', event));
        }

        win.addEventListener('resize', handleResize);

        return () => {
            win.removeEventListener('resize', handleResize);
        };
    }, [
        setOpen,
        alignItemWithTriggerActive,
        positionerElement,
        mounted
    ]);

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
            {
                style: transitionStatus === 'starting' ? DISABLED_TRANSITIONS_STYLE.style : undefined,
                className:
                    !listElement && alignItemWithTriggerActive ? styleDisableScrollbar.className : undefined
            },
            elementProps
        ]
    });

    return (
        <React.Fragment>
            {styleDisableScrollbar.element}
            <FloatingFocusManager context={context} modal={false} disabled={!mounted} restoreFocus>
                {element}
            </FloatingFocusManager>
        </React.Fragment>
    );
}

export namespace SelectPopup {
    export type Props = {
        children?: React.ReactNode;
        /**
         * @ignore
         */
        id?: string;
    } & HeadlessUIComponentProps<'div', State>;

    export type State = {
        side: TSide | 'none';
        align: TAlign;
        open: boolean;
        transitionStatus: TransitionStatus;
    };
}
