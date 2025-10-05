import React from 'react';

import { useDirection, useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useCompositeListItem } from '../../Composite';
import { isModifierKeySet } from '../../Composite/composite';
import { useCompositeListContext } from '../../Composite/list/CompositeListContext';
import { usePinInputFocusFunnelContext } from '../focus-funnel/PinInputFocusFunnelContext';
import { usePinInputRootContext } from '../root/PinInputRootContext';
import { pinInputStyleHookMapping } from '../utils/styleHooks';
import { testPattern } from '../utils/testPattern';

import type { PinInputRoot } from '../root/PinInputRoot';

import { handlePasteValue, handleSpecialKeys, shouldAllowKey } from './handleEvents';

export function PinInputPin(componentProps: PinInputPin.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;

    const {
        otp,
        mask,
        state: stateContext,
        placeholder,
        values,
        selectOnFocus,
        readOnly: readOnlyProp,
        pattern,
        type,
        focusedInputIndex,
        setFocusedInputIndex,
        setLastFocusedInputIndex,
        setFocused,
        setDirty,
        setFilled,
        setTouched,
        onValueChange: onPinInputValueChange
    } = usePinInputRootContext();

    const { ref: compositeRef, index } = useCompositeListItem();

    const id = useHeadlessUiId(idProp);
    const { elementsRef } = useCompositeListContext();
    const focusFunnelContext = usePinInputFocusFunnelContext(true);
    const direction = useDirection();

    const readOnly = ((focusFunnelContext?.focusMode === 'first-empty') && focusedInputIndex !== index) || readOnlyProp;
    const inputType = otp ? 'tel' : 'text';

    const state = React.useMemo(() => ({
        ...stateContext,
        value: values[index]
    }), [index, stateContext, values]);

    const element = useRenderElement('input', componentProps, {
        ref: [compositeRef, ref],
        state,
        props: [{
            id,
            'tabIndex': focusedInputIndex === index ? 0 : -1,
            'value': values[index] ?? '',
            'dir': direction,
            'inputMode': otp ? 'numeric' : 'text',
            'aria-invalid': !state.valid,
            'aria-label': `PIN digit ${index + 1}`,
            'aria-describedby': state.valid === false ? `${id}-error` : undefined,
            'type': mask ? 'password' : inputType,
            readOnly,
            'autoCapitalize': 'none',
            'autoComplete': otp ? 'one-time-code' : 'off',
            'placeholder': focusedInputIndex === index ? '' : placeholder,
            onFocus() {
                setFocused(true);
                setFocusedInputIndex(index);
                setLastFocusedInputIndex(index);

                if (selectOnFocus) {
                    (elementsRef.current[index] as HTMLInputElement | null)?.select();
                }
            },
            onBlur() {
                setTouched(true);
                setFocused(false);
                setFocusedInputIndex(null);
            },
            onChange(event) {
                const inputValue = event.target.value.at(-1) ?? '';

                // Validate input against pattern
                if (!testPattern(inputValue, type, pattern)) {
                    return;
                }

                // Update field state
                setDirty(true);
                setFilled(true);

                // Trigger value change callback
                onPinInputValueChange(inputValue, index, event.nativeEvent);

                // Auto-focus next input if available, or check completion for last input
                const nextIndex = index + 1;
                if (nextIndex < elementsRef.current.length) {
                    elementsRef.current[nextIndex]?.focus();
                }
            },
            onPaste(event) {
                handlePasteValue(event.clipboardData.getData('text'), index, {
                    elementsRef,
                    onPinInputValueChange,
                    setDirty,
                    setFilled,
                    type,
                    pattern
                });
            },
            onKeyDown(event) {
                if (event.defaultPrevented) {
                    return;
                }

                // Check if key should be allowed through
                if (shouldAllowKey(event)) {
                    return;
                }

                if (isModifierKeySet(event, [])) {
                    return;
                }

                // Handle special keys
                handleSpecialKeys(event, {
                    index,
                    elementsRef,
                    onPinInputValueChange,
                    direction,
                    focusMode: focusFunnelContext?.focusMode,
                    values
                });
            }
        }, elementProps],
        customStyleHookMapping: pinInputStyleHookMapping
    });

    return element;
}

export namespace PinInputPin {
    export type State = PinInputRoot.State;

    export type Props = Omit<HeadlessUIComponentProps<'input', State>, keyof Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof React.HTMLAttributes<HTMLInputElement>>>;

}
