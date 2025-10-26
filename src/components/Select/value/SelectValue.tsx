import React from 'react';

import { useStore } from '@flippo-ui/hooks';

import { useRenderElement } from '~@lib/hooks';
import { resolveMultipleLabels, resolveSelectedLabel } from '~@lib/resolveValueLabel';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useSelectRootContext } from '../root/SelectRootContext';
import { selectors } from '../store';

const customStyleHookMapping: StateAttributesMapping<SelectValue.State> = {
    value: () => null
};

/**
 * A text label of the currently selected item.
 * Renders a `<span>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectValue(componentProps: SelectValue.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        children: childrenProp,
        ref,
        ...elementProps
    } = componentProps;

    const { store, valueRef } = useSelectRootContext();

    const value = useStore(store, selectors.value);
    const items = useStore(store, selectors.items);
    const itemToStringLabel = useStore(store, selectors.itemToStringLabel);

    const state: SelectValue.State = React.useMemo(
        () => ({
            value
        }),
        [value]
    );

    const children
        = typeof childrenProp === 'function'
            ? childrenProp(value)
            : (childrenProp
              ?? (Array.isArray(value)
                  ? resolveMultipleLabels(value, itemToStringLabel)
                  : resolveSelectedLabel(value, items, itemToStringLabel)));

    const element = useRenderElement('span', componentProps, {
        state,
        ref: [ref, valueRef],
        props: [{ children }, elementProps],
        customStyleHookMapping
    });

    return element;
}

export namespace SelectValue {
    export type State = {
        /**
         * The value of the currently selected item.
         */
        value: any;
    };

    export type Props = {
        /**
         * Accepts a function that returns a `ReactNode` to format the selected value.
         * @example
         * ```tsx
         * <Select.Value>
         *   {(value: string | null) => value ? labels[value] : 'No value'}
         * </Select.Value>
         * ```
         */
        children?: React.ReactNode | ((value: any) => React.ReactNode);
    } & Omit<HeadlessUIComponentProps<'span', State>, 'children'>;
}
