'use client';

import React from 'react';

import { useControlledState, useEventCallback } from '@flippo-ui/hooks';

import { useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

import { MenuRadioGroupContext } from './MenuRadioGroupContext';

import type { TMenuRadioGroupContext } from './MenuRadioGroupContext';

/**
 * Groups related radio items.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export const InnerMenuRadioGroup = React.memo(
    (

        componentProps: MenuRadioGroup.Props
    ) => {
        const {
            /* eslint-disable unused-imports/no-unused-vars */
            className,
            render,
            /* eslint-enable unused-imports/no-unused-vars */
            value: valueProp,
            defaultValue,
            onValueChange: onValueChangeProp,
            disabled = false,
            ref,
            ...elementProps
        } = componentProps;

        const [value, setValueUnwrapped] = useControlledState({
            prop: valueProp,
            defaultProp: defaultValue,
            caller: 'MenuRadioGroup'
        });

        const onValueChange = useEventCallback(onValueChangeProp);

        const setValue = React.useCallback(
            (newValue: any, event: Event) => {
                setValueUnwrapped(newValue);
                onValueChange?.(newValue, event);
            },
            [onValueChange, setValueUnwrapped]
        );

        const state = React.useMemo(() => ({ disabled }), [disabled]);

        const element = useRenderElement('div', componentProps, {
            state,
            ref,
            props: {
                'role': 'group',
                'aria-disabled': disabled || undefined,
                ...elementProps
            }
        });

        const context: TMenuRadioGroupContext = React.useMemo(
            () => ({
                value,
                setValue,
                disabled
            }),
            [value, setValue, disabled]
        );

        return (
            <MenuRadioGroupContext value={context}>{element}</MenuRadioGroupContext>
        );
    }
);

export function MenuRadioGroup(props: MenuRadioGroup.Props) {
    return <InnerMenuRadioGroup {...props} />;
}

export namespace MenuRadioGroup {
    export type State = {
        disabled: boolean;
    };

    export type Props = {
    /**
     * The content of the component.
     */
        children?: React.ReactNode;
        /**
         * The controlled value of the radio item that should be currently selected.
         *
         * To render an uncontrolled radio group, use the `defaultValue` prop instead.
         */
        value?: any;
        /**
         * The uncontrolled value of the radio item that should be initially selected.
         *
         * To render a controlled radio group, use the `value` prop instead.
         */
        defaultValue?: any;
        /**
         * Function called when the selected value changes.
         *
         * @default () => {}
         */
        onValueChange?: (value: any, event: Event) => void;
        /**
         * Whether the component should ignore user interaction.
         *
         * @default false
         */
        disabled?: boolean;
    } & HeadlessUIComponentProps<'div', State>;
}
