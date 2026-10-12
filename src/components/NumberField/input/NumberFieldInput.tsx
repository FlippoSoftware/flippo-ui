import { toReactProps } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { fieldValidityMapping } from '../../Field/utils/constants';
import { useNumberFieldRootContext } from '../root/NumberFieldRootContext';
import { styleHookMapping } from '../utils/styleHooks';

import type { NumberFieldRoot } from '../root/NumberFieldRoot';

const stateAttributesMapping = {
    ...fieldValidityMapping,
    ...styleHookMapping
};

/**
 * The native input control in the number field.
 * Renders an `<input>` element.
 */
export function NumberFieldInput(componentProps: NumberFieldInput.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { numberField, state } = useNumberFieldRootContext();

    return useRenderElement('input', componentProps, {
        ref: [ref, numberField.setInputElement],
        state,
        props: [elementProps, (props) => toReactProps(numberField.getInputProps(props))],
        customStyleHookMapping: stateAttributesMapping
    });
}

export type NumberFieldInputState = {} & NumberFieldRoot.State;

export type NumberFieldInputProps = {
    /**
     * A string value that provides a user-friendly name for the role of the input.
     * @default 'Number field'
     */
    'aria-roledescription'?: React.AriaAttributes['aria-roledescription'] | undefined;
} & HeadlessUIComponentProps<'input', NumberFieldInput.State>;

export namespace NumberFieldInput {
    export type State = NumberFieldInputState;
    export type Props = NumberFieldInputProps;
}
