import React from 'react';

import { useControlledState } from '@flippo-ui/hooks';
import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps, HTMLProps, Orientation } from '~@lib/types';

import { CompositeRoot } from '../Composite/root/CompositeRoot';
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

const DEFAULT_VALUE: readonly any[] = [];
/**
 * Provides a shared state to a series of toggle buttons.
 *
 * Documentation: [Base UI Toggle Group](https://base-ui.com/react/components/toggle-group)
 */
export function ToggleGroup(componentProps: ToggleGroup.Props) {
    const {
        defaultValue: defaultValueProp,
        disabled: disabledProp = false,
        loopFocus = true,
        onValueChange,
        orientation = 'horizontal',
        multiple = false,
        value: valueProp,
        className,
        render,
        ref,
        ...elementProps
    } = componentProps;

    const toolbarContext = useToolbarRootContext(true);

    const defaultValue = React.useMemo(() => {
        if (valueProp === undefined) {
            return defaultValueProp ?? [];
        }

        return undefined;
    }, [valueProp, defaultValueProp]);

    const disabled = (toolbarContext?.disabled ?? false) || disabledProp;

    const [groupValue, setValueState] = useControlledState({
        prop: valueProp,
        defaultProp: defaultValue,
        caller: 'ToggleGroup'
    });

    const setGroupValue = useStableCallback(
        (
            newValue: string,
            nextPressed: boolean,
            eventDetails: HeadlessUIChangeEventDetails<typeof REASONS.none>
        ) => {
            let newGroupValue: any[] | undefined;
            if (multiple) {
                newGroupValue = groupValue!.slice();
                if (nextPressed) {
                    newGroupValue.push(newValue);
                }
                else {
                    newGroupValue.splice(groupValue!.indexOf(newValue), 1);
                }
            }
            else {
                newGroupValue = nextPressed ? [newValue] : [];
            }
            if (Array.isArray(newGroupValue)) {
                onValueChange?.(newGroupValue, eventDetails);

                if (eventDetails.isCanceled) {
                    return;
                }

                setValueState(newGroupValue);
            }
        }
    );

    const state: ToggleGroup.State = React.useMemo(
        () => ({ disabled, multiple, orientation }),
        [disabled, orientation, multiple]
    );

    const contextValue: ToggleGroupContextValue = React.useMemo(
        () => ({
            disabled,
            orientation,
            setGroupValue,
            value: groupValue ?? DEFAULT_VALUE
        }),
        [disabled, orientation, setGroupValue, groupValue]
    );

    const defaultProps: HTMLProps = {
        role: 'group'
    };

    const element = useRenderElement('div', componentProps, {
        enabled: Boolean(toolbarContext),
        state,
        ref,
        props: [defaultProps, elementProps],
        customStyleHookMapping: stateAttributesMapping
    });

    return (
        <ToggleGroupContext.Provider value={contextValue}>
            {toolbarContext
                ? (
                    element
                )
                : (
                    <CompositeRoot
                        render={render}
                        className={className}
                        state={state}
                        refs={[ref]}
                        props={[defaultProps, elementProps]}
                        stateAttributesMapping={stateAttributesMapping}
                        loopFocus={loopFocus}
                    />
                )}
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
