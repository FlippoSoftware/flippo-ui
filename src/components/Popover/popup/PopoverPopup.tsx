import React from 'react';

import { useEventCallback, useOpenChangeComplete } from '@flippo-ui/hooks';

import type { Interaction, TransitionStatus } from '@flippo-ui/hooks';

import { DISABLED_TRANSITIONS_STYLE, EMPTY_OBJECT } from '~@lib/constants';
import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';
import { FloatingFocusManager } from '~@packages/floating-ui-react';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { usePopoverPositionerContext } from '../positioner/PopoverPositionerContext';
import { usePopoverRootContext } from '../root/PopoverRootContext';

const customStyleHookMapping: StateAttributesMapping<PopoverPopup.State> = {
    ...popupStateMapping,
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
        initialFocus,
        finalFocus,
        ref,
        ...elementProps
    } = componentProps;

    const {
        open,
        instantType,
        transitionStatus,
        popupProps,
        titleId,
        descriptionId,
        popupRef,
        mounted,
        openReason,
        onOpenChangeComplete,
        modal,
        openMethod
    } = usePopoverRootContext();
    const positioner = usePopoverPositionerContext();

    useOpenChangeComplete({
        open,
        ref: popupRef,
        onComplete() {
            if (open) {
                onOpenChangeComplete?.(true);
            }
        }
    });

    // Default initial focus logic:
    // If opened by touch, focus the popup element to prevent the virtual keyboard from opening
    // (this is required for Android specifically as iOS handles this automatically).
    const defaultInitialFocus = useEventCallback((interactionType: Interaction) => {
        if (interactionType === 'touch') {
            return popupRef.current;
        }
        return true;
    });

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

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, popupRef],
        props: [popupProps, {
            'aria-labelledby': titleId,
            'aria-describedby': descriptionId
        }, transitionStatus === 'starting' ? DISABLED_TRANSITIONS_STYLE : EMPTY_OBJECT, elementProps],
        customStyleHookMapping
    });

    return (
        <FloatingFocusManager
          context={positioner.context}
          modal={modal === 'trap-focus'}
          disabled={!mounted || openReason === 'trigger-hover'}
          initialFocus={resolvedInitialFocus}
          returnFocus={finalFocus}
          restoreFocus={'popup'}
        >
            {element}
        </FloatingFocusManager>
    );
}

export namespace PopoverPopup {
    export type State = {
        /**
         * Whether the popover is currently open.
         */
        open: boolean;
        side: Side;
        align: Align;
        transitionStatus: TransitionStatus;
    };

    export type Props = {
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
    } & HeadlessUIComponentProps<'div', State>;
}
