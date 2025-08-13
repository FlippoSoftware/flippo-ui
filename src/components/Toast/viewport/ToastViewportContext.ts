import React from 'react';

export type TToastViewportContext = {
    viewportRef: React.RefObject<HTMLElement | null>;
};

export const ToastViewportContext = React.createContext<TToastViewportContext | undefined>(
    undefined
);

export function useToastViewportContext() {
    const context = React.use(ToastViewportContext);

    if (!context) {
        throw new Error(
            'Headless UI: ToastViewportContext is missing. Toast parts must be placed within <Toast.Viewport>.'
        );
    }
    return context;
}
