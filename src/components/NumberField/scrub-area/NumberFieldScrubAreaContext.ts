import React from 'react';

export type NumberFieldScrubAreaContextValue = {
    isScrubbing: boolean;
    isTouchInput: boolean;
    isPointerLockDenied: boolean;
    scrubAreaCursorRef: React.RefObject<HTMLSpanElement | null>;
    scrubAreaRef: React.RefObject<HTMLSpanElement | null>;
    direction: 'horizontal' | 'vertical';
    pixelSensitivity: number;
    teleportDistance: number | undefined;
};

export const NumberFieldScrubAreaContext = React.createContext<
    NumberFieldScrubAreaContextValue | undefined
>(undefined);

export function useNumberFieldScrubAreaContext() {
    const context = React.use(NumberFieldScrubAreaContext);
    if (context === undefined) {
        throw new Error(
            'Headless UI: NumberFieldScrubAreaContext is missing. NumberFieldScrubArea parts must be placed within <NumberField.ScrubArea>.'
        );
    }

    return context;
}
