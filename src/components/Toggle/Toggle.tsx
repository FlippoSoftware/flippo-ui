import React from 'react';

import { useControlledState, useEventCallback } from '@flippo-ui/hooks';
import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useRenderElement } from '~@lib/hooks';
import { REASONS } from '~@lib/reason';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { CompositeItem } from '../Composite/item/CompositeItem';
import { useToggleGroupContext } from '../ToggleGroup/ToggleGroupContext';
import { useButton } from '../use-button/useButton';

export function Toggle(componentProps: Toggle.Props) {
    const {
        className,
        defaultPressed: defaultPressedProp = false,
        disabled: disabledProp = false,
        /* eslint-disable unused-imports/no-unused-vars */
        form, // never participates in form validation
        type, // cannot change button type
        /* eslint-enable unused-imports/no-unused-vars */
        onPressedChange: onPressedChangeProp,
        pressed: pressedProp,
        render,
        value: valueProp,
        nativeButton = true,
        ref,
        ...elementProps
    } = componentProps;

    const value = valueProp ?? '';

    const groupContext = useToggleGroupContext();

    const groupValue = groupContext?.value ?? [];

    const defaultPressed = groupContext ? undefined : defaultPressedProp;

    const disabled = (disabledProp || groupContext?.disabled) ?? false;

    const [pressed, setPressedState] = useControlledState({
        prop: groupContext && value ? groupValue?.indexOf(value) > -1 : pressedProp,
        defaultProp: defaultPressed,
        caller: 'Toggle'
    });

    const onPressedChange = useStableCallback(
        (nextPressed: boolean, eventDetails: Toggle.ChangeEventDetails) => {
            groupContext?.setGroupValue?.(value, nextPressed, eventDetails);
            onPressedChangeProp?.(nextPressed, eventDetails);
        }
    );

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const state: Toggle.State = React.useMemo(
        () => ({
            disabled,
            pressed: Boolean(pressed)
        }),
        [disabled, pressed]
    );

    const refs = [buttonRef, ref];
    const props = [{
        'aria-pressed': pressed,
        onClick(event: React.MouseEvent) {
            const nextPressed = !pressed;
            const details = createChangeEventDetails(REASONS.none, event.nativeEvent);

            onPressedChange(nextPressed, details);

            if (details.isCanceled) {
                return;
            }

            setPressedState(nextPressed);
        }
    }, elementProps, getButtonProps];

    const element = useRenderElement('button', componentProps, {
        enabled: !groupContext,
        state,
        ref: refs,
        props
    });

    if (groupContext) {
        return (
            <CompositeItem
              tag={'button'}
              render={render}
              className={className}
              state={state}
              refs={refs}
              props={props}
            />
        );
    }

    return element;
}

export type ToggleState = {
    /**
     * Whether the toggle is currently pressed.
     */
    pressed: boolean;
    /**
     * Whether the toggle should ignore user interaction.
     */
    disabled: boolean;
};

export type ToggleProps = {
    /**
     * Whether the toggle button is currently pressed.
     * This is the controlled counterpart of `defaultPressed`.
     */
    pressed?: boolean;
    /**
     * Whether the toggle button is currently pressed.
     * This is the uncontrolled counterpart of `pressed`.
     * @default false
     */
    defaultPressed?: boolean;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * Callback fired when the pressed state is changed.
     */
    onPressedChange?: (pressed: boolean, eventDetails: Toggle.ChangeEventDetails) => void;
    /**
     * A unique string that identifies the toggle when used
     * inside a toggle group.
     */
    value?: string;
} & NativeButtonProps & HeadlessUIComponentProps<'button', Toggle.State>;

export type ToggleChangeEventReason = typeof REASONS.none;

export type ToggleChangeEventDetails = HeadlessUIChangeEventDetails<Toggle.ChangeEventReason>;

export namespace Toggle {
    export type State = ToggleState;
    export type Props = ToggleProps;
    export type ChangeEventReason = ToggleChangeEventReason;
    export type ChangeEventDetails = ToggleChangeEventDetails;
}
