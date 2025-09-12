'use client';

import { useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

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
export function FieldControlSlot() {
    const { controlProps, control, state } = useFieldControlContext();
    const { ref, ...elementProps } = controlProps;

    const element = useRenderElement(control, controlProps, {
        ref: ref as React.Ref<HTMLElement>,
        state,
        props: [elementProps],
        customStyleHookMapping: fieldValidityMapping
    });

    return element;
}

export namespace FieldControl {
    export type State = FieldRoot.State;

    export type Props = HeadlessUIComponentProps<'span', State>;
}
