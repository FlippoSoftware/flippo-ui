import React from 'react';

import { ToggleGroupMachine } from '@flippo-software/core-components/toggle-group';

import type { ToggleGroupOptions } from '@flippo-software/core-components/toggle-group';

import { toReactProps, useMachine, useTracker } from '~@lib/core';
import { useDirection, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps, Orientation } from '~@lib/types';

import { CompositeMachineProvider } from '../Composite/root/CompositeMachineProvider';
import { useToolbarRootContext } from '../Toolbar/root/ToolbarRootContext';

import { ToggleGroupContext } from './ToggleGroupContext';
import { ToggleGroupDataAttributes } from './ToggleGroupDataAttributes';

import type { ToggleGroupContextValue } from './ToggleGroupContext';

const stateAttributesMapping = {
    multiple(value: boolean) {
        if (value) {
            return { [ToggleGroupDataAttributes.multiple]: '' } as Record<string, string>;
        }
        return null;
    }
};

/**
 * Provides a shared state to a series of toggle buttons.
 * Renders a `<div>` element.
 */
export function ToggleGroup(componentProps: ToggleGroup.Props) {
    const {
        defaultValue,
        disabled = false,
        loopFocus = true,
        onValueChange,
        orientation = 'horizontal',
        multiple = false,
        value,
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const toolbarContext = useToolbarRootContext(true);
    const direction = useDirection();

    const group = useMachine((options) => new ToggleGroupMachine(options), {
        value,
        defaultValue,
        disabled,
        loopFocus,
        orientation,
        multiple,
        onValueChange: onValueChange as ToggleGroupOptions['onValueChange'],
        toolbarDisabled: toolbarContext?.disabled,
        // Inside a toolbar, the toolbar's composite navigates the toggles.
        inToolbar: Boolean(toolbarContext),
        direction
    });
    const track = useTracker();

    const { disabled: groupDisabled } = track(() => group.getState());
    const groupValue = track(() => group.value);

    const state: ToggleGroup.State = React.useMemo(
        () => ({ disabled: groupDisabled, multiple, orientation }),
        [groupDisabled, multiple, orientation]
    );

    const contextValue: ToggleGroupContextValue = React.useMemo(
        () => ({
            disabled: groupDisabled,
            orientation,
            setGroupValue: group.setGroupValue as ToggleGroupContextValue['setGroupValue'],
            value: groupValue
        }),
        [groupDisabled, orientation, group, groupValue]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: toolbarContext ? ref : [ref, group.composite.setRoot],
        props: [toReactProps(group.getRootProps()), elementProps],
        customStyleHookMapping: stateAttributesMapping
    });

    return (
        <ToggleGroupContext.Provider value={contextValue}>
            {toolbarContext ? element : <CompositeMachineProvider composite={group.composite}>{element}</CompositeMachineProvider>}
        </ToggleGroupContext.Provider>
    );
}

export type ToggleGroupState = {
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
    multiple: boolean;
};

export type ToggleGroupProps = {
    /**
     * The open state of the toggle group represented by an array of
     * the values of all pressed toggle buttons.
     * This is the controlled counterpart of `defaultValue`.
     */
    value?: readonly any[];
    /**
     * The open state of the toggle group represented by an array of
     * the values of all pressed toggle buttons.
     * This is the uncontrolled counterpart of `value`.
     */
    defaultValue?: readonly any[];
    /**
     * Callback fired when the pressed states of the toggle group changes.
     */
    onValueChange?: (groupValue: any[], eventDetails: ToggleGroup.ChangeEventDetails) => void;
    /**
     * Whether the toggle group should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * @default 'horizontal'
     */
    orientation?: Orientation;
    /**
     * Whether to loop keyboard focus back to the first item
     * when the end of the list is reached while using the arrow keys.
     * @default true
     */
    loopFocus?: boolean;
    /**
     * When `false` only one item in the group can be pressed. If any item in
     * the group becomes pressed, the others will become unpressed.
     * When `true` multiple items can be pressed.
     * @default false
     */
    multiple?: boolean;
} & HeadlessUIComponentProps<'div', ToggleGroup.State>;

export type ToggleGroupChangeEventReason = typeof REASONS.none;

export type ToggleGroupChangeEventDetails = HeadlessUIChangeEventDetails<ToggleGroup.ChangeEventReason>;

export namespace ToggleGroup {
    export type State = ToggleGroupState;
    export type Props = ToggleGroupProps;
    export type ChangeEventReason = ToggleGroupChangeEventReason;
    export type ChangeEventDetails = ToggleGroupChangeEventDetails;
}
