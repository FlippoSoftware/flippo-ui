import React from 'react';

import { useEnhancedClickHandler } from '../useEnhancedClickHandler';
import { useEventCallback } from '../useEventCallback';

import type { Interaction } from '../useEnhancedClickHandler';

export function useOpenInteractionType(open: boolean) {
    const [openMethod, setOpenMethod] = React.useState<Interaction | null>(null);

    const triggerClick = React.useCallback((_: React.MouseEvent | React.PointerEvent, interactionType: Interaction) => {
        if (!open)
            setOpenMethod(interactionType);
    }, [open, setOpenMethod]);

    const reset = useEventCallback(() => {
        setOpenMethod(null);
    });

    const { onClick, onPointerDown } = useEnhancedClickHandler(triggerClick);

    return React.useMemo(() => ({ openMethod, reset, triggerProps: { onPointerDown, onClick } }), [onClick, onPointerDown, openMethod, reset]);
}
