import type React from 'react';

import { getEventKey, isComposingEvent } from '@lib/event';
import { useDirection, useRenderElement } from '@lib/hooks';
import { ARABIC_RE, HAN_RE } from '@lib/parseNumeric';

import type { EventKeyMap, HeadlessUIComponentProps } from '@lib/types';

import { useCompositeItem } from '../../Composite';
import { isModifierKeySet } from '../../Composite/composite';
import { useCompositeListContext } from '../../Composite/list/CompositeListContext';
import { usePinInputRootContext } from '../root/PinInputRootContext';
import { pinInputStyleHookMapping } from '../utils/styleHooks';
import { testPattern } from '../utils/testPattern';

import type { PinInputRoot } from '../root/PinInputRoot';

const NAVIGATE_KEYS = new Set(['Tab', 'Enter', 'Escape']);

export function PinInputPin(componentProps: PinInputPin.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const {
        otp,
        mask,
        state,
        placeholder,
        values,
        controlRef,
        blurOnComplete,
        selectOnFocus,
        pattern,
        type,
        setFocused,
        setDirty,
        setFilled,
        setTouched,
        setCompleted,
        onValueChange: onPinInputValueChange
    } = usePinInputRootContext();

    const {
        index,
        compositeRef,
        isHighlighted,
        compositeProps
    } = useCompositeItem();

    const { elementsRef } = useCompositeListContext();
    const direction = useDirection();

    const inputType = otp ? 'tel' : 'text';
    const isCompleted = values.every((value) => value !== '') && values.length === elementsRef.current.length;

    const element = useRenderElement('input', componentProps, {
        state,
        ref: [compositeRef, ref],
        props: [{
            'value': values[index] ?? '',
            'dir': direction,
            'inputMode': otp ? 'numeric' : 'text',
            'aria-invalid': !state.valid,
            'type': mask ? 'password' : inputType,
            'maxLength': 1,
            'readOnly': true,
            'autoCapitalize': 'none',
            'autoComplete': otp ? 'one-time-code' : 'off',
            'placeholder': isHighlighted ? '' : placeholder,
            onFocus() {
                setFocused(true);
                if (selectOnFocus)
                    (elementsRef.current[index] as HTMLInputElement | null)?.select();
            },
            onBlur() {
                setTouched(true);
                setFocused(false);
            },
            onChange(event) {
                const newValue = event.target.value;

                if (!testPattern(newValue, type, pattern))
                    return;

                setDirty(true);
                setFilled(true);

                onPinInputValueChange(newValue, index, event.nativeEvent);

                if (isCompleted) {
                    setCompleted(true);

                    if (blurOnComplete)
                        (elementsRef.current[index] as HTMLInputElement | null)?.blur();

                    (controlRef.current as HTMLInputElement | null)?.form?.requestSubmit();
                }
            },
            onKeyDown(event) {
                if (event.defaultPrevented)
                    return;

                const isLatinNumeral = /^\d$/.test(event.key);
                const isArabicNumeral = ARABIC_RE.test(event.key);
                const isHanNumeral = HAN_RE.test(event.key);
                const isNavigateKey = NAVIGATE_KEYS.has(event.key);

                if (
                    // Allow composition events (e.g., pinyin)
                    // event.nativeEvent.isComposing does not work in Safari:
                    // https://bugs.webkit.org/show_bug.cgi?id=165004
                    isComposingEvent(event)
                    || isLatinNumeral
                    || isArabicNumeral
                    || isHanNumeral
                    || isNavigateKey
                ) {
                    return;
                }

                if (isModifierKeySet(event, []))
                    return;

                const keyMap: EventKeyMap = {
                    Backspace() {
                        onPinInputValueChange('', index, event.nativeEvent);

                        const nextIndex = index - 1 < 0 ? 0 : index - 1;
                        elementsRef.current[nextIndex]?.focus();

                        setCompleted(false);
                    },
                    Delete() {
                        onPinInputValueChange('', index, event.nativeEvent);
                        setCompleted(false);
                    },
                    Enter() {
                        if (isCompleted) {
                            (controlRef.current as HTMLInputElement | null)?.form?.requestSubmit();
                            setCompleted(true);
                        }
                    }
                };

                const exec
                    = keyMap[
                        getEventKey(event, {
                            dir: direction,
                            orientation: 'horizontal'
                        })
                    ];

                if (exec) {
                    exec(event);
                }
            }
        }, compositeProps, elementProps],
        customStyleHookMapping: pinInputStyleHookMapping
    });

    return element;
}

export namespace PinInputPin {
    export type State = PinInputRoot.State;

    export type Props = Omit<HeadlessUIComponentProps<'input', State>, keyof Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof React.HTMLAttributes<HTMLInputElement>>>;

}
