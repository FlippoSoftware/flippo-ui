import type { TInteraction } from './useEnhancedClickHandler';
import * as React from 'react';
import { useEnhancedClickHandler } from './useEnhancedClickHandler';

export function useOpenInteractionType(open: boolean) {
  const [openMethod, setOpenMethod] = React.useState<TInteraction | null>(null);

  const triggerClick = React.useCallback((_: React.MouseEvent | React.PointerEvent, interactionType: TInteraction) => {
    if (!open)
      setOpenMethod(interactionType);
  }, [open, setOpenMethod]);

  const { onClick, onPointerDown } = useEnhancedClickHandler(triggerClick);

  return React.useMemo(() => ({ onClick, triggerProps: { onPointerDown, openMethod } }), [onClick, onPointerDown, openMethod]);
}
