import * as React from 'react';

export type ScrollAreaScrollbarContextValue = {
    orientation: 'horizontal' | 'vertical';
};

export const ScrollAreaScrollbarContext = React.createContext<
  ScrollAreaScrollbarContextValue | undefined
>(undefined);

export function useScrollAreaScrollbarContext() {
    const context = React.use(ScrollAreaScrollbarContext);
    if (context === undefined) {
        throw new Error(
            'Headless UI: ScrollAreaScrollbarContext is missing. ScrollAreaScrollbar parts must be placed within <ScrollArea.Scrollbar>.'
        );
    }

    return context;
}
