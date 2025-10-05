import React from 'react';

import { useControlledState, useEventCallback } from '@flippo-ui/hooks';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { HeadlessUIComponentProps, HTMLProps, Orientation } from '~@lib/types';

import { CompositeRoot } from '../Composite/root/CompositeRoot';
import { useToolbarRootContext } from '../Toolbar/root/ToolbarRootContext';

import { ToggleGroupContext } from './ToggleGroupContext';
import { ToggleGroupDataAttributes } from './ToggleGroupDataAttributes';

import type { ToggleGroupContextValue } from './ToggleGroupContext';

const DEFAULT_VALUE: readonly any[] = [];

const customStyleHookMapping = {
    multiple(value: boolean) {
        if (value) {
            return { [ToggleGroupDataAttributes.multiple]: '' } as Record<string, string>;
        }
        return null;
    }
};

export function ToggleGroup(componentProps: ToggleGroup.Props) {
    const {
        value: valueProp,
        defaultValue: defaultValueProp,
        disabled: disabledProp = false,
        orientation = 'horizontal',
        loop = true,
        ref,
        multiple = false,
        className,
        render,
        onValueChange,
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
        defaultProp: defaultValue ?? DEFAULT_VALUE,
        caller: 'ToggleGroup'
    });

    const setGroupValue = useEventCallback(
        (newValue: string, nextPressed: boolean, eventDetails: HeadlessUIChangeEventDetails<'none'>) => {
            let newGroupValue: any[] | undefined;
            if (multiple) {
                newGroupValue = groupValue.slice();
                if (nextPressed) {
                    newGroupValue.push(newValue);
                }
                else {
                    newGroupValue.splice(groupValue.indexOf(newValue), 1);
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
            value: groupValue
        }),
        [
            disabled,
            orientation,
            setGroupValue,
            groupValue
        ]
    );

    const defaultProps: HTMLProps = {
        role: 'group'
    };

    const element = useRenderElement('div', componentProps, {
        enabled: Boolean(toolbarContext),
        state,
        ref,
        props: [defaultProps, elementProps],
        customStyleHookMapping
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
                        customStyleHookMapping={customStyleHookMapping}
                        loop={loop}
                    />
                )}
        </ToggleGroupContext.Provider>
    );
}

export namespace ToggleGroup {
    export type State = {
        /**
         * Whether the component should ignore user interaction.
         */
        disabled: boolean;
        multiple: boolean;
    };

    export type Props = {
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
         *
         * @param {any[]} groupValue An array of the `value`s of all the pressed items.
         * @param {Event} event The corresponding event that initiated the change.
         */
        onValueChange?: (groupValue: any[], eventDetails: ChangeEventDetails) => void;
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
        loop?: boolean;
        /**
         * When `false` only one item in the group can be pressed. If any item in
         * the group becomes pressed, the others will become unpressed.
         * When `true` multiple items can be pressed.
         * @default false
         */
        multiple?: boolean;
    } & HeadlessUIComponentProps<'div', State>;

    export type ChangeEventReason = 'none';
    export type ChangeEventDetails = HeadlessUIChangeEventDetails<ChangeEventReason>;
}
