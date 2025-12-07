import React from 'react';

import {
    useControlledState,
    useEventCallback,
    useIsoLayoutEffect,
    useMergedRef
} from '@flippo-ui/hooks';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { mergeProps } from '~@lib/merge';
import { REASONS } from '~@lib/reason';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useLabelableContext, useLabelableId } from '../../LabelableProvider';
import { useFieldRootContext } from '../root/FieldRootContext';
import { FieldControlSlot } from '../slot/FieldControlSlot';
import { useField } from '../useField';

import type { FieldRoot } from '../root/FieldRoot';

import { FieldControlContext } from './FieldControlContext';
import { useFieldControl } from './useFieldControl';

import type { FieldControlContextValue } from './FieldControlContext';

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
        setTouched,
        setDirty,
        validityData,
        setFocused,
        setFilled,
        validationMode,
        validation
    }
        = useFieldRootContext();
    const { labelId } = useLabelableContext();

    const id = useLabelableId({ id: idProp });

    useIsoLayoutEffect(() => {
        const hasExternalValue = valueProp != null;
        if (validation.inputRef.current?.value || (hasExternalValue && valueProp !== '')) {
            setFilled(true);
        }
        else if (hasExternalValue && valueProp === '') {
            setFilled(false);
        }
    }, [validation.inputRef, setFilled, valueProp]);

    const [value, setValueUnwrapped] = useControlledState({
        prop: valueProp,
        defaultProp: defaultValue,
        caller: 'FieldControl'
    });

    const isControlled = valueProp !== undefined;

    const setValue = useEventCallback(
        (nextValue: string, eventDetails: FieldControl.ChangeEventDetails) => {
            onValueChange?.(nextValue, eventDetails);

            if (eventDetails.isCanceled) {
                return;
            }

            setValueUnwrapped(nextValue);
        }
    );

    useField({
        id,
        name,
        commit: validation.commit,
        value,
        getValue: () => validation.inputRef.current?.value,
        controlRef: validation.inputRef
    });

    const mergedRef = useMergedRef(ref, validation.inputRef);

    const controlProps = React.useMemo(() => {
        const baseProps = {
            id,
            disabled,
            name,
            'ref': mergedRef,
            'aria-labelledby': labelId,
            ...(isControlled ? { value } : { defaultValue }),
            onChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
                const inputValue = event.currentTarget.value;
                setValue(inputValue, createChangeEventDetails(REASONS.none, event.nativeEvent));
                setDirty(inputValue !== validityData.initialValue);
                setFilled(inputValue !== '');
            },
            onFocus() {
                setFocused(true);
            },
            onBlur(event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
                setTouched(true);
                setFocused(false);

                if (validationMode === 'onBlur') {
                    validation.commit(event.currentTarget.value);
                }
            },
            onKeyDown(event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
                if (event.currentTarget.tagName === 'INPUT' && event.key === 'Enter') {
                    setTouched(true);
                    validation.commit(event.currentTarget.value);
                }
            }
        };

        return mergeProps(
            baseProps,
            elementProps,
            validation.getInputValidationProps()
        );
    }, [
        id,
        disabled,
        name,
        mergedRef,
        labelId,
        isControlled,
        value,
        defaultValue,
        elementProps,
        validation,
        setValue,
        setDirty,
        validityData.initialValue,
        setFilled,
        setFocused,
        setTouched,
        validationMode
    ]);

    const context: FieldControlContextValue = React.useMemo(() => ({
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
        onValueChange?: (value: string, eventDetails: ChangeEventDetails) => void;
        defaultValue?: React.ComponentProps<'input'>['defaultValue'];
    };
    export type TextAreaProps = HeadlessUIComponentProps<'textarea', State> & { control: 'textarea'; onValueChange?: (value: string, eventDetails: ChangeEventDetails) => void; defaultValue?: React.ComponentProps<'textarea'>['defaultValue'] };

    export type Props = (InputProps | TextAreaProps);

    export type ChangeEventReason = 'none';
    export type ChangeEventDetails = HeadlessUIChangeEventDetails<ChangeEventReason>;
}
