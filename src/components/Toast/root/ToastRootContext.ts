import React from 'react';

import type { ToastObject } from '../useToastManager';

export type TToastRootContext = {
    toast: ToastObject<any>;
    rootRef: React.RefObject<HTMLElement | null>;
    titleId: string | undefined;
    setTitleId: React.Dispatch<React.SetStateAction<string | undefined>>;
    descriptionId: string | undefined;
    setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
    swipeDirection: 'up' | 'down' | 'left' | 'right' | undefined;
};

export const ToastRootContext = React.createContext<TToastRootContext | undefined>(undefined);

export function useToastRootContext(): TToastRootContext {
    const context = React.use(ToastRootContext);

    if (!context) {
        throw new Error(
            'Headless UI: ToastRootContext is missing. Toast parts must be used within <Toast.Root>.'
        );
    }
    return context as TToastRootContext;
}
