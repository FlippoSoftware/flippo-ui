import React from 'react';

import { ButtonMachine } from '@flippo-software/core-components/button';
import { ToggleMachine } from '@flippo-software/core-components/toggle';

import type { ToggleOptions as ToggleMachineOptions } from '@flippo-software/core-components/toggle';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { CompositeItem } from '../Composite/item/CompositeItem';
import { useCompositeRootContext } from '../Composite/root/CompositeRootContext';
import { useToggleGroupContext } from '../ToggleGroup/ToggleGroupContext';

/**
 * A two-state button that can be on or off.
 * Renders a `<button>` element.
 */
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
    const isCompositeItem = useCompositeRootContext(true) !== undefined;

    // Inside a group, the group's value is the controlled pressed state.
    const toggle = useMachine((options) => new ToggleMachine(options), {
        pressed: groupContext && value ? groupContext.value.includes(value) : pressedProp,
        defaultPressed: groupContext ? undefined : defaultPressedProp,
        disabled: (disabledProp || groupContext?.disabled) ?? false,
        value,
        onPressedChange: ((nextPressed: boolean, eventDetails: Toggle.ChangeEventDetails) => {
            groupContext?.setGroupValue?.(value, nextPressed, eventDetails);
            onPressedChangeProp?.(nextPressed, eventDetails);
        }) as ToggleMachineOptions['onPressedChange']
    });
    const state: Toggle.State = useMachineState(toggle);
    const track = useTracker();

    const button = useMachine((options) => new ButtonMachine(options), {
        disabled: state.disabled,
        native: nativeButton,
        composite: isCompositeItem
    });

    const refs = [button.setElement, ref];
    const props = [
        track(() => toReactProps(toggle.getRootProps())),
        elementProps,
        (mergedProps: Record<string, any>) => track(() => button.getButtonProps(mergedProps))
    ];

    const element = useRenderElement('button', componentProps, {
        enabled: !groupContext,
        state,
        ref: refs,
        props
    });

    if (groupContext) {
        return <CompositeItem tag='button' render={render} className={className} state={state} refs={refs} props={props} />;
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
} & NativeButtonProps &
    HeadlessUIComponentProps<'button', Toggle.State>;

export type ToggleChangeEventReason = typeof REASONS.none;

export type ToggleChangeEventDetails = HeadlessUIChangeEventDetails<Toggle.ChangeEventReason>;

export namespace Toggle {
    export type State = ToggleState;
    export type Props = ToggleProps;
    export type ChangeEventReason = ToggleChangeEventReason;
    export type ChangeEventDetails = ToggleChangeEventDetails;
}
