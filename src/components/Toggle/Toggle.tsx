'use client';
import React from 'react';

import { useControlledState, useEventCallback } from '@flippo-ui/hooks';

import { useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps, NativeButtonProps } from '@lib/types';

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
        pressed: pressedProp,
        render,
        value: valueProp,
        nativeButton = true,
        ref,
        onPressedChange: onPressedChangeProp,
        ...elementProps
    } = componentProps;

    const value = valueProp ?? '';

    const groupContext = useToggleGroupContext();

    const groupValue = groupContext?.value ?? [];

    const defaultPressed = groupContext ? undefined : defaultPressedProp;

    const disabled = (disabledProp || groupContext?.disabled) ?? false;

    const [pressed, setPressedState] = useControlledState({
        prop: groupContext && value ? groupValue?.indexOf(value) > -1 : pressedProp,
        defaultProp: Boolean(defaultPressed),
        caller: 'Toggle'
    });

    const onPressedChange = useEventCallback((nextPressed: boolean, event: Event) => {
        groupContext?.setGroupValue?.(value, nextPressed, event);
        onPressedChangeProp?.(nextPressed, event);
    });

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const state: Toggle.State = React.useMemo(
        () => ({
            disabled,
            pressed
        }),
        [disabled, pressed]
    );

    const refs = [buttonRef, ref];
    const props = [{
        'aria-pressed': pressed,
        onClick(event: React.MouseEvent) {
            const nextPressed = !pressed;
            setPressedState(nextPressed);
            onPressedChange(nextPressed, event.nativeEvent);
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

export namespace Toggle {
    export type State = {
        /**
         * Whether the toggle is currently pressed.
         */
        pressed: boolean;
        /**
         * Whether the toggle should ignore user interaction.
         */
        disabled: boolean;
    };

    export type Props = {
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
         *
         * @param {boolean} pressed The new pressed state.
         * @param {Event} event The corresponding event that initiated the change.
         */
        onPressedChange?: (pressed: boolean, event: Event) => void;
        /**
         * A unique string that identifies the toggle when used
         * inside a toggle group.
         */
        value?: string;
    } & NativeButtonProps & HeadlessUIComponentProps<'button', State>;
}
