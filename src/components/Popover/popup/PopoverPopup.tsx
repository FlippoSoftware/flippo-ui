'use client';

import React from 'react';

import { useOpenChangeComplete } from '@flippo_ui/hooks';

import type { TInteraction, TransitionStatus } from '@flippo_ui/hooks';

import { DISABLED_TRANSITIONS_STYLE, EMPTY_OBJECT } from '@lib/constants';
import { useRenderElement } from '@lib/hooks';
import { popupStateMapping } from '@lib/popupStateMapping';
import { transitionStatusMapping } from '@lib/styleHookMapping';
import { FloatingFocusManager } from '@packages/floating-ui-react';

import type { CustomStyleHookMapping } from '@lib/getStyleHookProps';
import type { TAlign, TSide } from '@lib/hooks';
import type { HeadlessUIComponentProps } from '@lib/types';

import { usePopoverPositionerContext } from '../positioner/PopoverPositionerContext';
import { usePopoverRootContext } from '../root/PopoverRootContext';

const customStyleHookMapping: CustomStyleHookMapping<PopoverPopup.State> = {
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

    const resolvedInitialFocus = React.useMemo(() => {
        if (initialFocus == null) {
            if (openMethod === 'touch') {
                return popupRef;
            }
            return 0;
        }

        if (typeof initialFocus === 'function') {
            return initialFocus(openMethod ?? '');
        }

        return initialFocus;
    }, [initialFocus, openMethod, popupRef]);

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
        props: [
            popupProps,
            {
                'aria-labelledby': titleId,
                'aria-describedby': descriptionId
            },
            transitionStatus === 'starting' ? DISABLED_TRANSITIONS_STYLE : EMPTY_OBJECT,
            elementProps
        ],
        customStyleHookMapping
    });

    return (
        <FloatingFocusManager
          context={positioner.context}
          modal={modal === 'trap-focus'}
          disabled={!mounted || openReason === 'trigger-hover'}
          initialFocus={resolvedInitialFocus}
          returnFocus={finalFocus}
          restoreFocus={true}
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
        side: TSide;
        align: TAlign;
        transitionStatus: TransitionStatus;
    };

    export type Props = {
        /**
         * Determines the element to focus when the popover is opened.
         * By default, the first focusable element is focused.
         */
        initialFocus?:
          | React.RefObject<HTMLElement | null>
          | ((interactionType: TInteraction) => React.RefObject<HTMLElement | null>);
        /**
         * Determines the element to focus when the popover is closed.
         * By default, focus returns to the trigger.
         */
        finalFocus?: React.RefObject<HTMLElement | null>;
    } & HeadlessUIComponentProps<'div', State>;
}
