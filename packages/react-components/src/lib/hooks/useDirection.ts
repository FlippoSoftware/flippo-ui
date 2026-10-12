import React from 'react';

export type TextDirection = 'ltr' | 'rtl';

export type DirectionContextValue = {
    direction: TextDirection;
};

export const DirectionContext = React.createContext<DirectionContextValue | undefined>(undefined);

export function useDirection(optional = true) {
    const context = React.use(DirectionContext);
    if (context === undefined && !optional) {
        throw new Error('Flippo headless UI: DirectionContext is missing.');
    }

    return context?.direction ?? 'ltr';
}
