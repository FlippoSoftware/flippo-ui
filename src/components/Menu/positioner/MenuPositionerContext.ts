'use client';

import React from 'react';

import type { TAlign, TSide } from '@lib/hooks';
import type { FloatingContext } from '@packages/floating-ui-react';

export type TMenuPositionerContext = {
    /**
     * The side of the anchor element the popup is positioned relative to.
     */
    side: TSide;
    /**
     * How to align the popup relative to the specified side.
     */
    align: TAlign;
    arrowRef: React.RefObject<Element | null>;
    arrowUncentered: boolean;
    arrowStyles: React.CSSProperties;
    floatingContext: FloatingContext;
};

export const MenuPositionerContext = React.createContext<TMenuPositionerContext | undefined>(
    undefined
);

export function useMenuPositionerContext(optional?: false): TMenuPositionerContext;
export function useMenuPositionerContext(optional: true): TMenuPositionerContext | undefined;
export function useMenuPositionerContext(optional?: boolean) {
    const context = React.use(MenuPositionerContext);

    if (context === undefined && !optional) {
        throw new Error(
            'Headless UI: MenuPositionerContext is missing. MenuPositioner parts must be placed within <Menu.Positioner>.'
        );
    }
    return context;
}
