import React from 'react';

import { SelectValue as SelectValueCore } from '@flippo-software/core-components/select';

import { useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useSelectRoot } from '../root/SelectRootContext';

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
        ref,
        children: childrenProp,
        placeholder,
        ...elementProps
    } = componentProps;

    const root = useSelectRoot();
    const track = useTracker();
    const { value, placeholder: isPlaceholder } = track(() => SelectValueCore.getState(root));
    const state: SelectValue.State = React.useMemo(() => ({ value, placeholder: isPlaceholder }), [value, isPlaceholder]);

    let children: React.ReactNode;
    if (typeof childrenProp === 'function') {
        children = childrenProp(value);
    } else {
        const resolved = track(() =>
            SelectValueCore.resolve(root, { hasChildren: childrenProp != null, hasPlaceholder: placeholder != null })
        );
        if (resolved.kind === 'children') {
            children = childrenProp;
        } else if (resolved.kind === 'placeholder') {
            children = placeholder;
        } else if (resolved.kind === 'labels') {
            children = resolved.labels as React.ReactNode;
        } else {
            children = resolved.label as React.ReactNode;
        }
    }

    const setElement = React.useCallback((element: HTMLElement | null) => SelectValueCore.setElement(root, element), [root]);

    return useRenderElement('span', componentProps, {
        state,
        ref: [ref, setElement],
        props: [{ children }, elementProps],
        customStyleHookMapping
    });
}

export type SelectValueState = {
    /**
     * The value of the currently selected item.
     */
    value: any;
    /**
     * Whether the placeholder is being displayed.
     */
    placeholder: boolean;
};

export type SelectValueProps = {
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
    /**
     * The placeholder value to display when no value is selected.
     * This is overridden by `children` if specified, or by a null item's label in `items`.
     */
    placeholder?: React.ReactNode;
} & Omit<HeadlessUIComponentProps<'span', SelectValue.State>, 'children'>;

export namespace SelectValue {
    export type State = SelectValueState;
    export type Props = SelectValueProps;
}
