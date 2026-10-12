import React from 'react';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useSelectItemContext } from '../item/SelectItemContext';

/**
 * A text label of the select item.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectItemText(componentProps: SelectItemTextProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { item } = useSelectItemContext();

    return useRenderElement('div', componentProps, {
        ref: [ref, item.setTextElement],
        props: elementProps
    });
}

export type SelectItemTextState = {};

export type SelectItemTextProps = {} & HeadlessUIComponentProps<'div', SelectItemText.State>;

export namespace SelectItemText {
    export type State = SelectItemTextState;
    export type Props = SelectItemTextProps;
}
