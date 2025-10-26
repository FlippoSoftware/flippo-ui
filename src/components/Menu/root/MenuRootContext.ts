import React from 'react';

import type { TransitionStatus } from '@flippo-ui/hooks';

import type { HTMLProps } from '~@lib/types';
import type { FloatingRootContext } from '~@packages/floating-ui-react';

import type { MenuParent, MenuRoot } from './MenuRoot';

export type MenuRootContextValue = {
    disabled: boolean;
    typingRef: React.RefObject<boolean>;
    modal: boolean;
    activeIndex: number | null;
    floatingRootContext: FloatingRootContext;
    itemProps: HTMLProps;
    popupProps: HTMLProps;
    triggerProps: HTMLProps;
    itemDomElements: React.RefObject<(HTMLElement | null)[]>;
    itemLabels: React.RefObject<(string | null)[]>;
    mounted: boolean;
    open: boolean;
    popupRef: React.RefObject<HTMLElement | null>;
    setOpen: (open: boolean, eventDetails: MenuRoot.ChangeEventDetails) => void;
    positionerRef: React.RefObject<HTMLElement | null>;
    setPositionerElement: (element: HTMLElement | null) => void;
    triggerElement: HTMLElement | null;
    setTriggerElement: (element: HTMLElement | null) => void;
    transitionStatus: TransitionStatus;
    allowMouseUpTriggerRef: React.RefObject<boolean>;
    lastOpenChangeReason: MenuRoot.ChangeEventReason | null;
    instantType: 'dismiss' | 'click' | 'group' | undefined;
    onOpenChangeComplete: ((open: boolean) => void) | undefined;
    setHoverEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
    parent: MenuParent;
    rootId: string | undefined;
    allowMouseEnter: boolean;
    setAllowMouseEnter: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MenuRootContext = React.createContext<MenuRootContextValue | undefined>(undefined);

export function useMenuRootContext(optional?: false): MenuRootContextValue;
export function useMenuRootContext(optional: true): MenuRootContextValue | undefined;
export function useMenuRootContext(optional?: boolean) {
    const context = React.use(MenuRootContext);
    if (context === undefined && !optional) {
        throw new Error(
            'Base UI: MenuRootContext is missing. Menu parts must be placed within <Menu.Root>.'
        );
    }

    return context;
}
