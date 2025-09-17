'use client';

import React from 'react';

import {
    useControlledState,
    useEventCallback,
    useIsoLayoutEffect,
    useMergedRef
} from '@flippo-ui/hooks';

import { useHeadlessUiId } from '@lib/hooks';
import { mergeProps } from '@lib/merge';

import type { HeadlessUIComponentProps } from '@lib/types';

import { useFieldRootContext } from '../root/FieldRootContext';
import { FieldControlSlot } from '../slot/FieldControlSlot';
import { useField } from '../useField';

import type { FieldRoot } from '../root/FieldRoot';

import { FieldControlContext } from './FieldControlContext';
import { useFieldControl } from './useFieldControl';
import { useFieldControlValidation } from './useFieldControlValidation';

import type { TFieldControlContext } from './FieldControlContext';

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
export function FieldControl(componentProps: FieldControl.InputProps): React.JSX.Element;
export function FieldControl(componentProps: FieldControl.TextAreaProps): React.JSX.Element;
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
        children,
        control,
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

    const mergedRef = useMergedRef(ref, inputRef);

    const controlProps = React.useMemo(() => {
        const baseProps = {
            id,
            disabled,
            name,
            'ref': mergedRef,
            'aria-labelledby': labelId,
            value,
            onChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
                setValue(event.currentTarget.value, event.nativeEvent);

                setDirty(event.currentTarget.value !== validityData.initialValue);
                setFilled(event.currentTarget.value !== '');
            },
            onFocus() {
                setFocused(true);
            },
            onBlur(event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
                setTouched(true);
                setFocused(false);

                if (validationMode === 'onBlur') {
                    commitValidation(event.currentTarget.value);
                }
            },
            onKeyDown(event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
                if ((event.currentTarget.tagName === 'INPUT' || event.currentTarget.tagName === 'TEXTAREA') && event.key === 'Enter') {
                    setTouched(true);
                    commitValidation(event.currentTarget.value);
                }
            }
        };

        return mergeProps(
            baseProps,
            elementProps,
            getValidationProps(),
            getInputValidationProps()
        );
    }, [
        id,
        disabled,
        name,
        mergedRef,
        labelId,
        value,
        elementProps,
        getValidationProps,
        getInputValidationProps,
        setDirty,
        validityData.initialValue,
        setFilled,
        setValue,
        setFocused,
        setTouched,
        validationMode,
        commitValidation
    ]);

    const context: TFieldControlContext = React.useMemo(() => ({
        state,
        controlRef: mergedRef,
        setValue,
        control: control ?? 'input',
        value,
        controlProps
    }), [
        control,
        controlProps,
        mergedRef,
        setValue,
        state,
        value
    ]);

    return (
        <FieldControlContext value={context}>
            {children}
        </FieldControlContext>
    );
}

FieldControl.Slot = FieldControlSlot;
FieldControl.useFieldControl = useFieldControl;

export namespace FieldControl {
    export type State = FieldRoot.State;

    export type InputSlotProps = FieldControlSlot.InputProps;
    export type TextAreaSlotProps = FieldControlSlot.TextAreaProps;
    export type SlotProps = FieldControlSlot.Props;

    export type InputProps = HeadlessUIComponentProps<'input', State> & {
        control: 'input';
        onValueChange?: (value: string, event: Event) => void;
        defaultValue?: React.ComponentProps<'input'>['defaultValue'];
    };
    export type TextAreaProps = HeadlessUIComponentProps<'textarea', State> & { control: 'textarea'; onValueChange?: (value: string, event: Event) => void; defaultValue?: React.ComponentProps<'textarea'>['defaultValue'] };

    export type Props = (InputProps | TextAreaProps);
}
