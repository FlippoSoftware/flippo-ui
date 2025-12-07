import React from 'react';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { SelectScrollArrow } from '../scroll-arrow/SelectScrollArrow';

/**
 * An element that scrolls the select menu up when hovered.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectScrollUpArrow(componentProps: SelectScrollUpArrow.Props) {
    return <SelectScrollArrow {...componentProps} direction={'up'} />;
}

export type SelectScrollUpArrowState = {};

export type SelectScrollUpArrowProps = {
    /**
     * Whether to keep the HTML element in the DOM while the select popup is not scrollable.
     * @default false
     */
    keepMounted?: boolean;
} & HeadlessUIComponentProps<'div', SelectScrollUpArrow.State>;

export namespace SelectScrollUpArrow {
    export type State = SelectScrollUpArrowState;
    export type Props = SelectScrollUpArrowProps;
}
