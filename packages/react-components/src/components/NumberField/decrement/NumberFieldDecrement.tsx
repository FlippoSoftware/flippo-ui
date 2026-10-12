import { NumberFieldButtonMachine } from '@flippo-software/core-components/number-field';

import { toReactProps, useMachine, useMachineState } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useNumberFieldRootContext } from '../root/NumberFieldRootContext';
import { styleHookMapping } from '../utils/styleHooks';

import type { NumberFieldRoot } from '../root/NumberFieldRoot';

/**
 * A stepper button that decrements the field value when clicked (and keeps doing so while pressed).
 * Renders a `<button>` element.
 */
export function NumberFieldDecrement(componentProps: NumberFieldDecrement.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        disabled,
        nativeButton = true,
        ...elementProps
    } = componentProps;

    const { numberField } = useNumberFieldRootContext();

    const button = useMachine((options) => new NumberFieldButtonMachine(numberField, false, options), {
        disabled,
        nativeButton
    });
    const state: NumberFieldDecrement.State = useMachineState(button);

    return useRenderElement('button', componentProps, {
        ref: [ref, button.button.setElement],
        state,
        props: [elementProps, (props) => toReactProps(button.getProps(props))],
        customStyleHookMapping: styleHookMapping
    });
}

export type NumberFieldDecrementState = {} & NumberFieldRoot.State;

export type NumberFieldDecrementProps = {} & NativeButtonProps & HeadlessUIComponentProps<'button', NumberFieldDecrement.State>;

export namespace NumberFieldDecrement {
    export type State = NumberFieldDecrementState;
    export type Props = NumberFieldDecrementProps;
}
