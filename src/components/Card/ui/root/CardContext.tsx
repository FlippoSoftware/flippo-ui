import React from 'react';

export type CardContextValue = {
    titleId: string;
    descriptionId: string;
};

export const CardContext = React.createContext<CardContextValue | null>(null);

export function useCardContext() {
    const context = React.use(CardContext);
    if (!context) {
        throw new Error('Card components must be used within Card.Root');
    }
    return context;
}

export function useOptionalCardContext() {
    return React.use(CardContext);
}
