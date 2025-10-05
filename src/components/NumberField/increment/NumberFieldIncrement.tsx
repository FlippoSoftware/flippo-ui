import React from 'react';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useButton } from '../../use-button';
import { useNumberFieldRootContext } from '../root/NumberFieldRootContext';
import { useNumberFieldButton } from '../root/useNumberFieldButton';
import { styleHookMapping } from '../utils/styleHooks';

import type { NumberFieldRoot } from '../root/NumberFieldRoot';

/**
 * A stepper button that increases the field value when clicked.
 * Renders an `<button>` element.
 *
 * Documentation: [Base UI Number Field](https://base-ui.com/react/components/number-field)
 */
export function NumberFieldIncrement(componentProps: NumberFieldIncrement.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled: disabledProp = false,
        nativeButton = true,
        ref,
        ...elementProps
    } = componentProps;

    const {
        allowInputSyncRef,
        disabled: contextDisabled,
        formatOptionsRef,
        getStepAmount,
        id,
        incrementValue,
        inputRef,
        inputValue,
        intentionalTouchCheckTimeout,
        isPressedRef,
        locale,
        maxWithDefault,
        minWithDefault,
        movesAfterTouchRef,
        readOnly,
        setValue,
        startAutoChange,
        state,
        stopAutoChange,
        value,
        valueRef,
        lastChangedValueRef,
        onValueCommitted
    } = useNumberFieldRootContext();

    const disabled = disabledProp || contextDisabled;

    const { props } = useNumberFieldButton({
        isIncrement: true,
        inputRef,
        startAutoChange,
        stopAutoChange,
        minWithDefault,
        maxWithDefault,
        value,
        inputValue,
        disabled,
        readOnly,
        id,
        setValue,
        getStepAmount,
        incrementValue,
        allowInputSyncRef,
        formatOptionsRef,
        valueRef,
        isPressedRef,
        intentionalTouchCheckTimeout,
        movesAfterTouchRef,
        locale,
        lastChangedValueRef,
        onValueCommitted
    });

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const buttonState = React.useMemo(
        () => ({
            ...state,
            disabled
        }),
        [state, disabled]
    );

    const element = useRenderElement('button', componentProps, {
        ref: [ref, buttonRef],
        state: buttonState,
        props: [props, elementProps, getButtonProps],
        customStyleHookMapping: styleHookMapping
    });

    return element;
}

export namespace NumberFieldIncrement {
    export type State = NumberFieldRoot.State;

    export type Props = NativeButtonProps & HeadlessUIComponentProps<'button', State>;
}
