'use client';

import React from 'react';

import { useEventCallback, useMergedRef, useTimeout } from '@flippo-ui/hooks';
import { getParentNode, isHTMLElement, isLastTraversableNode } from '@floating-ui/utils/dom';

import { getPseudoElementBounds } from '@lib/getPseudoElementBounds';
import { useRenderElement } from '@lib/hooks';
import { mergeProps } from '@lib/merge';
import { ownerDocument } from '@lib/owner';
import { pressableTriggerOpenStateMapping } from '@lib/popupStateMapping';
import { useFloatingTree } from '@packages/floating-ui-react/index';
import { contains } from '@packages/floating-ui-react/utils';

import type { HeadlessUIComponentProps, HTMLProps, NativeButtonProps } from '@lib/types';

import { CompositeItem } from '../../Composite/item/CompositeItem';
import { useButton } from '../../use-button/useButton';
import { useMenuRootContext } from '../root/MenuRootContext';

const BOUNDARY_OFFSET = 2;

/**
 * A button that opens the menu.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuTrigger(componentProps: MenuTrigger.Props) {
    const {
        render,
        className,
        disabled: disabledProp = false,
        nativeButton = true,
        ref: refProp,
        ...elementProps
    } = componentProps;

    const {
        triggerProps: rootTriggerProps,
        disabled: menuDisabled,
        setTriggerElement,
        open,
        allowMouseUpTriggerRef,
        positionerRef,
        parent,
        lastOpenChangeReason,
        rootId
    } = useMenuRootContext();

    const disabled = disabledProp || menuDisabled;

    const triggerRef = React.useRef<HTMLElement | null>(null);
    const allowMouseUpTriggerTimeout = useTimeout();

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const handleRef = useMergedRef(buttonRef, setTriggerElement);
    const { events: menuEvents } = useFloatingTree()!;

    React.useEffect(() => {
        if (!open && parent.type === undefined) {
            allowMouseUpTriggerRef.current = false;
        }
    }, [allowMouseUpTriggerRef, open, parent.type]);

    const handleDocumentMouseUp = useEventCallback((mouseEvent: MouseEvent) => {
        if (!triggerRef.current) {
            return;
        }

        allowMouseUpTriggerTimeout.clear();
        allowMouseUpTriggerRef.current = false;

        const mouseUpTarget = mouseEvent.target as Element | null;

        if (
            contains(triggerRef.current, mouseUpTarget)
            || contains(positionerRef.current, mouseUpTarget)
            || mouseUpTarget === triggerRef.current
        ) {
            return;
        }

        if (mouseUpTarget != null && findRootOwnerId(mouseUpTarget) === rootId) {
            return;
        }

        const bounds = getPseudoElementBounds(triggerRef.current);

        if (
            mouseEvent.clientX >= bounds.left - BOUNDARY_OFFSET
            && mouseEvent.clientX <= bounds.right + BOUNDARY_OFFSET
            && mouseEvent.clientY >= bounds.top - BOUNDARY_OFFSET
            && mouseEvent.clientY <= bounds.bottom + BOUNDARY_OFFSET
        ) {
            return;
        }

        menuEvents.emit('close', { domEvent: mouseEvent, reason: 'cancel-open' });
    });

    React.useEffect(() => {
        if (open && lastOpenChangeReason === 'trigger-hover') {
            const doc = ownerDocument(triggerRef.current);
            doc.addEventListener('mouseup', handleDocumentMouseUp, { once: true });
        }
    }, [open, handleDocumentMouseUp, lastOpenChangeReason]);

    const isMenubar = parent.type === 'menubar';

    const getTriggerProps = React.useCallback(
        (externalProps?: HTMLProps): HTMLProps => {
            return mergeProps(
                isMenubar ? { role: 'menuitem' } : {},
                {
                    'aria-haspopup': 'menu' as const,
                    'ref': handleRef,
                    'onMouseDown': (event: React.MouseEvent) => {
                        if (open) {
                            return;
                        }

                        // mousedown -> mouseup on menu item should not trigger it within 200ms.
                        allowMouseUpTriggerTimeout.start(200, () => {
                            allowMouseUpTriggerRef.current = true;
                        });

                        const doc = ownerDocument(event.currentTarget);
                        doc.addEventListener('mouseup', handleDocumentMouseUp, { once: true });
                    }
                },
                externalProps,
                getButtonProps
            );
        },
        [
            getButtonProps,
            handleRef,
            open,
            allowMouseUpTriggerRef,
            allowMouseUpTriggerTimeout,
            handleDocumentMouseUp,
            isMenubar
        ]
    );

    const state: MenuTrigger.State = React.useMemo(
        () => ({
            disabled,
            open
        }),
        [disabled, open]
    );

    const ref = [triggerRef, refProp, buttonRef];
    const props = [rootTriggerProps, elementProps, getTriggerProps];

    const element = useRenderElement('button', componentProps, {
        enabled: !isMenubar,
        state,
        ref,
        props,
        customStyleHookMapping: pressableTriggerOpenStateMapping
    });

    if (isMenubar) {
        return (
            <CompositeItem
                tag={'button'}
                render={render}
                className={className}
                state={state}
                refs={ref}
                props={props}
                customStyleHookMapping={pressableTriggerOpenStateMapping}
            />
        );
    }

    return element;
}

export namespace MenuTrigger {
    export type State = {
    /**
     * Whether the menu is currently open.
     */
        open: boolean;
    };

    export type Props = {
        children?: React.ReactNode;
        /**
         * Whether the component should ignore user interaction.
         * @default false
         */
        disabled?: boolean;
    } & NativeButtonProps & HeadlessUIComponentProps<'button', State>;
}

function findRootOwnerId(node: Node): string | undefined {
    if (isHTMLElement(node) && node.hasAttribute('data-rootownerid')) {
        return node.getAttribute('data-rootownerid') ?? undefined;
    }

    if (isLastTraversableNode(node)) {
        return undefined;
    }

    return findRootOwnerId(getParentNode(node));
}
