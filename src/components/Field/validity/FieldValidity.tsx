import React from 'react';

import { useFieldRootContext } from '../root/FieldRootContext';

import type { FieldValidityData } from '../root/FieldRoot';

/**
 * Used to display a custom message based on the field’s validity.
 * Requires `children` to be a function that accepts field validity state as an argument.
 *
 * Documentation: [Base UI Field](https://base-ui.com/react/components/field)
 */
export function FieldValidity(props: FieldValidity.Props) {
    const { children } = props;
    const { validityData, invalid, field } = useFieldRootContext(false);

    // biome-ignore lint/correctness/useExhaustiveDependencies: `validityData` and `invalid` are what the state derives from.
    const fieldValidityState: FieldValidityState = React.useMemo(
        () => field?.getValidityState() as FieldValidityState,
        [field, validityData, invalid]
    );

    return <React.Fragment>{children(fieldValidityState)}</React.Fragment>;
}

export type FieldValidityState = {
    validity: FieldValidityData['state'];
} & Omit<FieldValidityData, 'state'>;

export namespace FieldValidity {
    export type State = object;

    export type Props = {
        /**
         * A function that accepts the field validity state as an argument.
         *
         * ```jsx
         * <Field.Validity>
         *   {(validity) => {
         *     return <div>...</div>
         *   }}
         * </Field.Validity>
         * ```
         */
        children: (state: FieldValidityState) => React.ReactNode;
    };
}
