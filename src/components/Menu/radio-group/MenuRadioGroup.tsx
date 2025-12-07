import React from 'react';

import { useControlledState } from '@flippo-ui/hooks';
import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import type { MenuRoot } from '../root/MenuRoot';

import { MenuRadioGroupContext } from './MenuRadioGroupContext';

import type { MenuRadioGroupContextValue } from './MenuRadioGroupContext';

/**
 * Groups related radio items.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
const Inner = React.memo(
    (
        componentProps: MenuRadioGroup.Props
    ) => {
        const {
            /* eslint-disable unused-imports/no-unused-vars */
            render,
            className,
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

        const onValueChange = useStableCallback(onValueChangeProp);

        const setValue = useStableCallback(
            (newValue: any, eventDetails: MenuRadioGroup.ChangeEventDetails) => {
                onValueChange?.(newValue, eventDetails);

                if (eventDetails.isCanceled) {
                    return;
                }

                setValueUnwrapped(newValue);
            }
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

        const context: MenuRadioGroupContextValue = React.useMemo(
            () => ({
                value,
                setValue,
                disabled
            }),
            [value, setValue, disabled]
        );

        return (
            <MenuRadioGroupContext.Provider value={context}>{element}</MenuRadioGroupContext.Provider>
        );
    }
);

export function MenuRadioGroup(componentProps: MenuRadioGroup.Props) {
    return <Inner {...componentProps} />;
}

export type MenuRadioGroupProps = {
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
     */
    onValueChange?: (value: any, eventDetails: MenuRadioGroup.ChangeEventDetails) => void;
    /**
     * Whether the component should ignore user interaction.
     *
     * @default false
     */
    disabled?: boolean;
} & HeadlessUIComponentProps<'div', MenuRadioGroup.State>;

export type MenuRadioGroupState = {
    disabled: boolean;
};

export type MenuRadioGroupChangeEventReason = MenuRoot.ChangeEventReason;
export type MenuRadioGroupChangeEventDetails = MenuRoot.ChangeEventDetails;

export namespace MenuRadioGroup {
    export type Props = MenuRadioGroupProps;
    export type State = MenuRadioGroupState;
    export type ChangeEventReason = MenuRadioGroupChangeEventReason;
    export type ChangeEventDetails = MenuRadioGroupChangeEventDetails;
}
