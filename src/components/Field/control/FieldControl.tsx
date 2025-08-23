'use client';

import React from 'react';

import { useControlledState, useEventCallback, useIsoLayoutEffect } from '@flippo_ui/hooks';

import { useHeadlessUiId, useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

import { useFieldRootContext } from '../root/FieldRootContext';
import { useField } from '../useField';
import { fieldValidityMapping } from '../utils/constants';

import type { FieldRoot } from '../root/FieldRoot';

import { useFieldControlValidation } from './useFieldControlValidation';

/**
 * The form control to label and validate.
 * Renders an `<input>` element.
 *
 * You can omit this part and use any Base UI input component instead. For example,
 * [Input](https://base-ui.com/react/components/input), [Checkbox](https://base-ui.com/react/components/checkbox),
 * or [Select](https://base-ui.com/react/components/select), among others, will work with Field out of the box.
 *
 * Documentation: [Base UI Field](https://base-ui.com/react/components/field)
 */
export function FieldControl(componentProps: FieldControl.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        id: idProp,
        name: nameProp,
        value: valueProp,
        disabled: disabledProp = false,
        onValueChange,
        defaultValue,
        ref,
        ...elementProps
    } = componentProps;

    const { state: fieldState, name: fieldName, disabled: fieldDisabled } = useFieldRootContext();

    const disabled = fieldDisabled || disabledProp;
    const name = fieldName ?? nameProp;

    const state: FieldControl.State = React.useMemo(
        () => ({
            ...fieldState,
            disabled
        }),
        [fieldState, disabled]
    );

    const {
        setControlId,
        labelId,
        setTouched,
        setDirty,
        validityData,
        setFocused,
        setFilled,
        validationMode
    } = useFieldRootContext();

    const {
        getValidationProps,
        getInputValidationProps,
        commitValidation,
        inputRef
    }
        = useFieldControlValidation();

    const id = useHeadlessUiId(idProp);

    useIsoLayoutEffect(() => {
        setControlId(id);
        return () => {
            setControlId(undefined);
        };
    }, [id, setControlId]);

    useIsoLayoutEffect(() => {
        const hasExternalValue = valueProp != null;
        if (inputRef.current?.value || (hasExternalValue && valueProp !== '')) {
            setFilled(true);
        }
        else if (hasExternalValue && valueProp === '') {
            setFilled(false);
        }
    }, [inputRef, setFilled, valueProp]);

    const [value, setValueUnwrapped] = useControlledState({
        prop: valueProp,
        defaultProp: defaultValue,
        caller: 'FieldControl'
    });

    const isControlled = valueProp !== undefined;

    const setValue = useEventCallback((nextValue: string, event: Event) => {
        setValueUnwrapped(nextValue);
        onValueChange?.(nextValue, event);
    });

    useField({
        id,
        name,
        commitValidation,
        value,
        getValue: () => inputRef.current?.value,
        controlRef: inputRef
    });

    const element = useRenderElement('input', componentProps, {
        ref,
        state,
        props: [
            {
                id,
                disabled,
                name,
                'ref': inputRef,
                'aria-labelledby': labelId,
                ...(isControlled ? { value } : { defaultValue }),
                onChange(event) {
                    if (value != null) {
                        setValue(event.currentTarget.value, event.nativeEvent);
                    }

                    setDirty(event.currentTarget.value !== validityData.initialValue);
                    setFilled(event.currentTarget.value !== '');
                },
                onFocus() {
                    setFocused(true);
                },
                onBlur(event) {
                    setTouched(true);
                    setFocused(false);

                    if (validationMode === 'onBlur') {
                        commitValidation(event.currentTarget.value);
                    }
                },
                onKeyDown(event) {
                    if (event.currentTarget.tagName === 'INPUT' && event.key === 'Enter') {
                        setTouched(true);
                        commitValidation(event.currentTarget.value);
                    }
                }
            },
            getValidationProps(),
            getInputValidationProps(),
            elementProps
        ],
        customStyleHookMapping: fieldValidityMapping
    });

    return element;
}

export namespace FieldControl {
    export type State = FieldRoot.State;

    export type Props = {
        /**
         * Callback fired when the `value` changes. Use when controlled.
         */
        onValueChange?: (value: string, event: Event) => void;
        defaultValue?: React.ComponentProps<'input'>['defaultValue'];
    } & HeadlessUIComponentProps<'input', State>;
}
