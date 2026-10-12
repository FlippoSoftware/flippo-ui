import React from 'react';

import type { ScrollAreaMachine } from '@flippo-software/core-components/scroll-area';

import type { HiddenState, OverflowEdges, ScrollAreaRoot, Size } from './ScrollAreaRoot';

export type ScrollAreaRootContextValue = {
    /**
     * The core machine: measures the viewport, positions the thumbs and handles dragging and hover.
     */
    scrollArea: ScrollAreaMachine;
    hovering: boolean;
    scrollingX: boolean;
    scrollingY: boolean;
    touchModality: boolean;
    cornerSize: Size;
    thumbSize: Size;
    hiddenState: HiddenState;
    overflowEdges: OverflowEdges;
    viewportState: ScrollAreaRoot.State;
};

export const ScrollAreaRootContext = React.createContext<ScrollAreaRootContextValue | undefined>(undefined);

export function useScrollAreaRootContext() {
    const context = React.use(ScrollAreaRootContext);
    if (context === undefined) {
        throw new Error('Headless UI: ScrollAreaRootContext is missing. ScrollArea parts must be placed within <ScrollArea.Root>.');
    }
    return context;
}
