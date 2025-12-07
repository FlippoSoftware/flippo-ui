import React from 'react';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { SelectScrollArrow } from '../scroll-arrow/SelectScrollArrow';

/**
 * An element that scrolls the select menu down when hovered.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectScrollDownArrow(componentProps: SelectScrollDownArrow.Props) {
    return <SelectScrollArrow {...componentProps} direction={'down'} />;
}

export type SelectScrollDownArrowState = {};

export type SelectScrollDownArrowProps = {
    /**
     * Whether to keep the HTML element in the DOM while the select popup is not scrollable.
     * @default false
     */
    keepMounted?: boolean;
} & HeadlessUIComponentProps<'div', SelectScrollDownArrow.State>;

export namespace SelectScrollDownArrow {
    export type State = SelectScrollDownArrowState;
    export type Props = SelectScrollDownArrowProps;
}
