import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useFieldControlContext } from '../control/FieldControlContext';
import { fieldValidityMapping } from '../utils/constants';

import type { FieldRoot } from '../root/FieldRoot';

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
export function FieldControlSlot(componentProps: FieldControlSlot.InputProps): React.JSX.Element;
export function FieldControlSlot(componentProps: FieldControlSlot.TextAreaProps): React.JSX.Element;
export function FieldControlSlot(componentProps: FieldControlSlot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { controlProps, control, state } = useFieldControlContext();
    const { ref: controlRef, ...otherControlProps } = controlProps;

    const element = useRenderElement(control, componentProps, {
        ref: [ref, controlRef],
        state: {
            slot: true,
            ...state
        },
        props: [elementProps, otherControlProps],
        customStyleHookMapping: fieldValidityMapping
    });

    return element;
}

export namespace FieldControlSlot {
    export type State = FieldRoot.State;

    export type InputProps = Omit<HeadlessUIComponentProps<'input', State>, keyof Omit <React.InputHTMLAttributes<HTMLInputElement>, keyof React.HTMLAttributes <HTMLInputElement>>>;
    export type TextAreaProps = Omit<HeadlessUIComponentProps<'textarea', State>, keyof Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, keyof React.HTMLAttributes<HTMLTextAreaElement>>>;

    export type Props = InputProps | TextAreaProps;
}
