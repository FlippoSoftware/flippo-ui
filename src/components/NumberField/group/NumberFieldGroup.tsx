import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useNumberFieldRootContext } from '../root/NumberFieldRootContext';
import { styleHookMapping } from '../utils/styleHooks';

import type { NumberFieldRoot } from '../root/NumberFieldRoot';

/**
 * Groups the input with the increment and decrement buttons.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Number Field](https://base-ui.com/react/components/number-field)
 */
export function NumberFieldGroup(componentProps: NumberFieldGroup.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { state } = useNumberFieldRootContext();

    const element = useRenderElement('div', componentProps, {
        ref,
        state,
        props: [{ role: 'group' }, elementProps],
        customStyleHookMapping: styleHookMapping
    });

    return element;
}

export namespace NumberFieldGroup {
    export type State = NumberFieldRoot.State;

    export type Props = HeadlessUIComponentProps<'div', State>;
}
