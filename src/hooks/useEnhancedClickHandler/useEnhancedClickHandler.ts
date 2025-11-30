import React from 'react';

export type Interaction = 'mouse' | 'touch' | 'pen' | 'keyboard' | '';

export function useEnhancedClickHandler(handler: (event: React.MouseEvent | React.PointerEvent, interactionType: Interaction) => void) {
    const lastInteractionTypeRef = React.useRef<Interaction>('');

    const onPointerDown = React.useCallback((event: React.PointerEvent) => {
        if (event.defaultPrevented)
            return;

        lastInteractionTypeRef.current = event.pointerType;
    }, []);

    const onClick = React.useCallback((event: React.MouseEvent | React.PointerEvent) => {
        if (event.detail)
            handler(event, 'keyboard');
        else if ('pointerType' in event)
            handler(event, event.pointerType);
        else
            handler(event, lastInteractionTypeRef.current);

        lastInteractionTypeRef.current = '';
    }, [handler]);

    return { onClick, onPointerDown };
}
