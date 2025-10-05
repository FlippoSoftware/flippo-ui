import * as React from 'react';

import { CLICK_TRIGGER_IDENTIFIER } from '~@lib/constants';
import { useRenderElement } from '~@lib/hooks';
import {
    pressableTriggerOpenStateMapping,
    triggerOpenStateMapping
} from '~@lib/popupStateMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useButton } from '../../use-button/useButton';
import { usePopoverRootContext } from '../root/PopoverRootContext';

/**
 * A button that opens the popover.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Popover](https://base-ui.com/react/components/popover)
 */
export function PopoverTrigger(componentProps: PopoverTrigger.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled = false,
        nativeButton = true,
        ref,
        ...elementProps
    } = componentProps;

    const {
        open,
        setTriggerElement,
        triggerProps,
        openReason
    } = usePopoverRootContext();

    const state: PopoverTrigger.State = React.useMemo(
        () => ({
            disabled,
            open
        }),
        [disabled, open]
    );

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const customStyleHookMapping: StateAttributesMapping<{ open: boolean }> = React.useMemo(
        () => ({
            open(value) {
                if (value && openReason === 'trigger-press') {
                    return pressableTriggerOpenStateMapping.open(value);
                }

                return triggerOpenStateMapping.open(value);
            }
        }),
        [openReason]
    );

    const element = useRenderElement('button', componentProps, {
        state,
        ref: [buttonRef, setTriggerElement, ref],
        props: [
            triggerProps,
            { [CLICK_TRIGGER_IDENTIFIER as string]: '' },
            elementProps,
            getButtonProps
        ],
        customStyleHookMapping
    });

    return element;
}

export namespace PopoverTrigger {
    export type State = {
        /**
         * Whether the popover is currently disabled.
         */
        disabled: boolean;
        /**
         * Whether the popover is currently open.
         */
        open: boolean;
    };

    export type Props = NativeButtonProps & HeadlessUIComponentProps<'button', State>;
}
