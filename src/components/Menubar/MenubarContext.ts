import React from 'react';

import type { MenuRoot } from '../Menu/root/MenuRoot';

export type MenubarContextValue = {
    modal: boolean;
    disabled?: boolean;
    contentElement: HTMLElement | null;
    setContentElement: (element: HTMLElement | null) => void;
    hasSubmenuOpen: boolean;
    setHasSubmenuOpen: (open: boolean) => void;
    orientation: MenuRoot.Orientation;
    allowMouseUpTriggerRef: React.RefObject<boolean>;
    rootId: string | undefined;
};

export const MenubarContext = React.createContext<MenubarContextValue | null>(null);

export function useMenubarContext(optional?: false): MenubarContextValue;
export function useMenubarContext(optional: true): MenubarContextValue | null;
export function useMenubarContext(optional?: boolean) {
    const context = React.use(MenubarContext);
    if (context === null && !optional) {
        throw new Error(
            'Headless UI: MenubarContext is missing. Menubar parts must be placed within <Menubar>.'
        );
    }

    return context;
}
