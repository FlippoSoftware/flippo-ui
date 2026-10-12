import React from 'react';

import { MenuRadioGroupMachine } from '@flippo-software/core-components/menu';

import { toReactProps, useMachine, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import type { MenuRoot } from '../root/MenuRoot';

import { MenuRadioGroupContext } from './MenuRadioGroupContext';

/**
 * Groups related radio items.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuRadioGroup(componentProps: MenuRadioGroup.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        value,
        defaultValue,
        onValueChange,
        disabled = false,
        ref,
        ...elementProps
    } = componentProps;

    const group = useMachine((options) => new MenuRadioGroupMachine(options), {
        value,
        defaultValue,
        onValueChange: onValueChange as never,
        disabled
    });
    const track = useTracker();

    const state: MenuRadioGroup.State = React.useMemo(() => ({ disabled }), [disabled]);

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: [elementProps, (props) => track(() => toReactProps(group.getGroupProps(props)))]
    });

    return <MenuRadioGroupContext value={group}>{element}</MenuRadioGroupContext>;
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
