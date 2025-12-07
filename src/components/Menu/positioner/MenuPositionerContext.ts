import React from 'react';

import type { Align, Side } from '~@lib/hooks';

export type MenuPositionerContextValue = {
    /**
     * The side of the anchor element the popup is positioned relative to.
     */
    side: Side;
    /**
     * How to align the popup relative to the specified side.
     */
    align: Align;
    arrowRef: React.RefObject<Element | null>;
    arrowUncentered: boolean;
    arrowStyles: React.CSSProperties;
    nodeId: string | undefined;
};

export const MenuPositionerContext = React.createContext<MenuPositionerContextValue | undefined>(
    undefined
);

export function useMenuPositionerContext(optional?: false): MenuPositionerContextValue;
export function useMenuPositionerContext(optional: true): MenuPositionerContextValue | undefined;
export function useMenuPositionerContext(optional?: boolean) {
    const context = React.use(MenuPositionerContext);
    if (context === undefined && !optional) {
        throw new Error(
            'Base UI: MenuPositionerContext is missing. MenuPositioner parts must be placed within <Menu.Positioner>.'
        );
    }
    return context;
}
