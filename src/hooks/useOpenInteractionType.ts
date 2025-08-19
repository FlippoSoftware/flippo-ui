import type { TInteraction } from './useEnhancedClickHandler';
import * as React from 'react';
import { useEnhancedClickHandler } from './useEnhancedClickHandler';
import { useEventCallback } from './useEventCallback';

export function useOpenInteractionType(open: boolean) {
    const [openMethod, setOpenMethod] = React.useState<TInteraction | null>(null);

    const triggerClick = React.useCallback((_: React.MouseEvent | React.PointerEvent, interactionType: TInteraction) => {
        if (!open)
            setOpenMethod(interactionType);
    }, [open, setOpenMethod]);

    const reset = useEventCallback(() => {
        setOpenMethod(null);
    });

    const { onClick, onPointerDown } = useEnhancedClickHandler(triggerClick);

    return React.useMemo(() => ({ openMethod, reset, triggerProps: { onPointerDown, onClick } }), [
        onClick,
        onPointerDown,
        openMethod,
        reset
    ]);
}
