import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

import {
    useComboboxDerivedItemsContext,
    useComboboxRootContext
} from '../root/ComboboxRootContext';

/**
 * Renders its children only when the list is empty.
 * Requires the `items` prop on the root component.
 * Announces changes politely to screen readers.
 * Renders a `<div>` element.
 */
export function ComboboxEmpty(componentProps: ComboboxEmpty.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        children: childrenProp,
        ref,
        ...elementProps
    } = componentProps;

    const { filteredItems } = useComboboxDerivedItemsContext();
    const store = useComboboxRootContext();

    const children = filteredItems.length === 0 ? childrenProp : null;

    return useRenderElement('div', componentProps, {
        ref: [ref, store.state.emptyRef],
        props: [{
            children,
            'role': 'status',
            'aria-live': 'polite',
            'aria-atomic': true
        }, elementProps]
    });
}

export type ComboboxEmptyState = {};

export type ComboboxEmptyProps = {} & HeadlessUIComponentProps<'div', ComboboxEmpty.State>;

export namespace ComboboxEmpty {
    export type State = ComboboxEmptyState;
    export type Props = ComboboxEmptyProps;
}
