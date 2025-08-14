'use client';

import React from 'react';

import type { Orientation } from '@lib/types';

import type { CompositeMetadata } from '../../Composite/list/CompositeList';

import type { ToolbarRoot } from './ToolbarRoot';

export type TToolbarRootContext = {
    disabled: boolean;
    orientation: Orientation;
    setItemMap: React.Dispatch<
        React.SetStateAction<Map<Node, CompositeMetadata<ToolbarRoot.ItemMetadata> | null>>
    >;
};

export const ToolbarRootContext = React.createContext<TToolbarRootContext | undefined>(undefined);

export function useToolbarRootContext(optional?: false): TToolbarRootContext;
export function useToolbarRootContext(optional: true): TToolbarRootContext | undefined;
export function useToolbarRootContext(optional?: boolean) {
    const context = React.use(ToolbarRootContext);

    if (context === undefined && !optional) {
        throw new Error(
            'Headless UI: ToolbarRootContext is missing. Toolbar parts must be placed within <Toolbar.Root>.'
        );
    }

    return context;
}
