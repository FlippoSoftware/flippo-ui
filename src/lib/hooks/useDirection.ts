'use client';
import * as React from 'react';

export type TTextDirection = 'ltr' | 'rtl';

export type TDirectionContext = {
    direction: TTextDirection;
};

export const DirectionContext = React.createContext<TDirectionContext | undefined>(undefined);

export function useDirection(optional = true) {
    const context = React.use(DirectionContext);
    if (context === undefined && !optional) {
        throw new Error('Flippo headless UI: DirectionContext is missing.');
    }

    return context?.direction ?? 'ltr';
}
