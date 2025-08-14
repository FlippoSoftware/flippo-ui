'use client';

import React from 'react';

import type { HeadlessUIComponentProps } from '@lib/types';

import { Separator } from '../../Separator';
import { useToolbarRootContext } from '../root/ToolbarRootContext';

/**
 * A separator element accessible to screen readers.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Toolbar](https://base-ui.com/react/components/toolbar)
 */
export function ToolbarSeparator(props: ToolbarSeparator.Props) {
    const { orientation } = useToolbarRootContext();

    return <Separator {...props} orientation={orientation} />;
}

export namespace ToolbarSeparator {
    export type Props = HeadlessUIComponentProps<'div', Separator.State> & Separator.Props;
}
