'use client';

import React from 'react';

import type { HeadlessUIComponentProps } from '@lib/types';

import { SelectScrollArrow } from '../scroll-arrow/SelectScrollArrow';

/**
 * An element that scrolls the select menu up when hovered.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectScrollUpArrow(props: SelectScrollUpArrow.Props) {
    return <SelectScrollArrow {...props} direction={'up'} />;
}

export namespace SelectScrollUpArrow {
    export type State = object;

    export type Props = {
        /**
         * Whether to keep the HTML element in the DOM while the select menu is not scrollable.
         * @default false
         */
        keepMounted?: boolean;
    } & HeadlessUIComponentProps<'div', State>;
}
