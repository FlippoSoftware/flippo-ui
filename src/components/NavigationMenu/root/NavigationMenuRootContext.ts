import * as React from 'react';

import type { TransitionStatus } from '@flippo-ui/hooks';

import type { FloatingRootContext } from '~@packages/floating-ui-react';

import type { NavigationMenuRoot } from './NavigationMenuRoot';

export type NavigationMenuRootContextValue = {
    open: boolean;
    value: any;
    setValue: (value: any, eventDetails: NavigationMenuRoot.ChangeEventDetails) => void;
    transitionStatus: TransitionStatus;
    mounted: boolean;
    popupElement: HTMLElement | null;
    setPopupElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    positionerElement: HTMLElement | null;
    setPositionerElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    viewportElement: HTMLElement | null;
    setViewportElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    viewportTargetElement: HTMLElement | null;
    setViewportTargetElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    activationDirection: 'left' | 'right' | 'up' | 'down' | null;
    setActivationDirection: React.Dispatch<
        React.SetStateAction<'left' | 'right' | 'up' | 'down' | null>
    >;
    floatingRootContext: FloatingRootContext | undefined;
    setFloatingRootContext: React.Dispatch<React.SetStateAction<FloatingRootContext | undefined>>;
    currentContentRef: React.RefObject<HTMLDivElement | null>;
    nested: boolean;
    rootRef: React.RefObject<HTMLDivElement | null>;
    beforeInsideRef: React.RefObject<HTMLSpanElement | null>;
    afterInsideRef: React.RefObject<HTMLSpanElement | null>;
    beforeOutsideRef: React.RefObject<HTMLSpanElement | null>;
    afterOutsideRef: React.RefObject<HTMLSpanElement | null>;
    prevTriggerElementRef: React.RefObject<Element | null | undefined>;
    delay: number;
    closeDelay: number;
    orientation: 'horizontal' | 'vertical';
    viewportInert: boolean;
    setViewportInert: React.Dispatch<React.SetStateAction<boolean>>;
};

export const NavigationMenuRootContext = React.createContext<NavigationMenuRootContextValue | undefined>(
    undefined
);

if (process.env.NODE_ENV !== 'production') {
    NavigationMenuRootContext.displayName = 'NavigationMenuRootContext';
}

function useNavigationMenuRootContext(optional?: false): NavigationMenuRootContextValue;
function useNavigationMenuRootContext(optional: true): NavigationMenuRootContextValue | undefined;
function useNavigationMenuRootContext(optional?: boolean) {
    const context = React.use(NavigationMenuRootContext);
    if (context === undefined && !optional) {
        throw new Error(
            'Base UI: NavigationMenuRootContext is missing. Navigation Menu parts must be placed within <NavigationMenu.Root>.'
        );
    }
    return context;
}

export const NavigationMenuTreeContext = React.createContext<string | undefined>(undefined);

function useNavigationMenuTreeContext() {
    return React.use(NavigationMenuTreeContext);
}

export { useNavigationMenuRootContext, useNavigationMenuTreeContext };
