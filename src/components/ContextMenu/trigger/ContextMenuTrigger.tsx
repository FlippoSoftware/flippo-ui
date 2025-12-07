import React from 'react';

import { useTimeout } from '@flippo-ui/hooks';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useRenderElement } from '~@lib/hooks';
import { ownerDocument } from '~@lib/owner';
import { pressableTriggerOpenStateMapping } from '~@lib/popupStateMapping';
import { REASONS } from '~@lib/reason';
import { contains, getTarget, stopEvent } from '~@packages/floating-ui-react/utils';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useMenuRootContext } from '../../Menu/root/MenuRootContext';
import { findRootOwnerId } from '../../Menu/utils/findRootOwnerId';
import { useContextMenuRootContext } from '../root/ContextMenuRootContext';

const LONG_PRESS_DELAY = 500;

/**
 * An area that opens the menu on right click or long press.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Context Menu](https://base-ui.com/react/components/context-menu)
 */
export function ContextMenuTrigger(componentProps: ContextMenuTrigger.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const {
        setAnchor,
        actionsRef,
        internalBackdropRef,
        backdropRef,
        positionerRef,
        allowMouseUpTriggerRef,
        initialCursorPointRef,
        rootId
    } = useContextMenuRootContext(false);

    const { store } = useMenuRootContext(false);
    const open = store.useState('open');

    const triggerRef = React.useRef<HTMLDivElement | null>(null);
    const touchPositionRef = React.useRef<{ x: number; y: number } | null>(null);
    const longPressTimeout = useTimeout();
    const allowMouseUpTimeout = useTimeout();
    const allowMouseUpRef = React.useRef(false);

    function handleLongPress(x: number, y: number, event: MouseEvent | TouchEvent) {
        const isTouchEvent = event.type.startsWith('touch');

        initialCursorPointRef.current = { x, y };

        setAnchor({
            getBoundingClientRect() {
                return DOMRect.fromRect({
                    width: isTouchEvent ? 10 : 0,
                    height: isTouchEvent ? 10 : 0,
                    x,
                    y
                });
            }
        });

        allowMouseUpRef.current = false;
        actionsRef.current?.setOpen(true, createChangeEventDetails(REASONS.triggerPress, event));

        allowMouseUpTimeout.start(LONG_PRESS_DELAY, () => {
            allowMouseUpRef.current = true;
        });
    }

    function handleContextMenu(event: React.MouseEvent) {
        allowMouseUpTriggerRef.current = true;
        stopEvent(event);
        handleLongPress(event.clientX, event.clientY, event.nativeEvent);
        const doc = ownerDocument(triggerRef.current);

        doc.addEventListener(
            'mouseup',
            (mouseEvent: MouseEvent) => {
                allowMouseUpTriggerRef.current = false;

                if (!allowMouseUpRef.current) {
                    return;
                }

                allowMouseUpTimeout.clear();
                allowMouseUpRef.current = false;

                const mouseUpTarget = getTarget(mouseEvent) as Element | null;

                if (contains(positionerRef.current, mouseUpTarget)) {
                    return;
                }

                if (rootId && mouseUpTarget && findRootOwnerId(mouseUpTarget) === rootId) {
                    return;
                }

                actionsRef.current?.setOpen(
                    false,
                    createChangeEventDetails(REASONS.cancelOpen, mouseEvent)
                );
            },
            { once: true }
        );
    }

    function handleTouchStart(event: React.TouchEvent) {
        allowMouseUpTriggerRef.current = false;
        if (event.touches.length === 1) {
            event.stopPropagation();
            const touch = event.touches[0];
            touchPositionRef.current = { x: touch?.clientX ?? 0, y: touch?.clientY ?? 0 };
            longPressTimeout.start(LONG_PRESS_DELAY, () => {
                if (touchPositionRef.current) {
                    handleLongPress(
                        touchPositionRef.current.x,
                        touchPositionRef.current.y,
                        event.nativeEvent
                    );
                }
            });
        }
    }

    function handleTouchMove(event: React.TouchEvent) {
        if (longPressTimeout.isStarted() && touchPositionRef.current && event.touches.length === 1) {
            const touch = event.touches[0];
            const moveThreshold = 10;

            const deltaX = Math.abs(touch?.clientX ?? 0 - touchPositionRef.current.x);
            const deltaY = Math.abs(touch?.clientY ?? 0 - touchPositionRef.current.y);

            if (deltaX > moveThreshold || deltaY > moveThreshold) {
                longPressTimeout.clear();
            }
        }
    }

    function handleTouchEnd() {
        longPressTimeout.clear();
        touchPositionRef.current = null;
    }

    React.useEffect(() => {
        function handleDocumentContextMenu(event: MouseEvent) {
            const target = getTarget(event);
            const targetElement = target as HTMLElement | null;
            if (
                contains(triggerRef.current, targetElement)
                || contains(internalBackdropRef.current, targetElement)
                || contains(backdropRef.current, targetElement)
            ) {
                event.preventDefault();
            }
        }

        const doc = ownerDocument(triggerRef.current);
        doc.addEventListener('contextmenu', handleDocumentContextMenu);
        return () => {
            doc.removeEventListener('contextmenu', handleDocumentContextMenu);
        };
    }, [backdropRef, internalBackdropRef]);

    const state: ContextMenuTrigger.State = React.useMemo(
        () => ({
            open
        }),
        [open]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [triggerRef, ref],
        props: [{
            onContextMenu: handleContextMenu,
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
            onTouchCancel: handleTouchEnd,
            style: {
                WebkitTouchCallout: 'none'
            }
        }, elementProps],
        customStyleHookMapping: pressableTriggerOpenStateMapping
    });

    return element;
}

export type ContextMenuTriggerState = {
    /**
     * Whether the context menu is currently open.
     */
    open: boolean;
};

export type ContextMenuTriggerProps = {} & HeadlessUIComponentProps<'div', ContextMenuTrigger.State>;

export namespace ContextMenuTrigger {
    export type State = ContextMenuTriggerState;
    export type Props = ContextMenuTriggerProps;
}
