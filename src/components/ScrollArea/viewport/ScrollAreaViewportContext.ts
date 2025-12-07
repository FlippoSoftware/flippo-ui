import React from 'react';

export type ScrollAreaViewportContextValue = {
    computeThumbPosition: () => void;
};

export const ScrollAreaViewportContext = React.createContext<ScrollAreaViewportContextValue | undefined>(
    undefined
);

export function useScrollAreaViewportContext() {
    const context = React.use(ScrollAreaViewportContext);
    if (context === undefined) {
        throw new Error(
            'Base UI: ScrollAreaViewportContext missing. ScrollAreaViewport parts must be placed within <ScrollArea.Viewport>.'
        );
    }
    return context;
}
