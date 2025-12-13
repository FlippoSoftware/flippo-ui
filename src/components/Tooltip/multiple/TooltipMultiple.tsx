import React from 'react';

import type { TooltipRoot } from '../root/TooltipRoot';

import { TooltipMultipleContext } from './TooltipMultipleContext';
import { TooltipMultipleStore } from './TooltipMultipleStore';

/**
 * Wrapper component that synchronizes multiple tooltips.
 * All tooltips within this wrapper will open and close together.
 *
 * The store registers all tooltip contexts, providing access to their
 * triggers and popups for safePolygon tracking.
 *
 * @example
 * ```tsx
 * <Tooltip.Multiple>
 *   <Tooltip.Root>
 *     <Tooltip.Trigger primary>Trigger 1</Tooltip.Trigger>
 *     <Tooltip.Portal>
 *       <Tooltip.Positioner>
 *         <Tooltip.Popup>Tooltip 1 content</Tooltip.Popup>
 *       </Tooltip.Positioner>
 *     </Tooltip.Portal>
 *   </Tooltip.Root>
 *
 *   <Tooltip.Root>
 *     <Tooltip.Trigger primary>Trigger 2</Tooltip.Trigger>
 *     <Tooltip.Portal>
 *       <Tooltip.Positioner>
 *         <Tooltip.Popup>Tooltip 2 content</Tooltip.Popup>
 *       </Tooltip.Positioner>
 *     </Tooltip.Portal>
 *   </Tooltip.Root>
 * </Tooltip.Multiple>
 * ```
 */
export function TooltipMultiple(props: TooltipMultiple.Props) {
    const { defaultOpen = false, onOpenChange, children } = props;

    const store = TooltipMultipleStore.useStore(defaultOpen);

    // Set up callback
    React.useEffect(() => {
        store.context.onOpenChange = onOpenChange;
    }, [store, onOpenChange]);

    const contextValue = React.useMemo(() => ({ store }), [store]);

    return (
        <TooltipMultipleContext.Provider value={contextValue}>
            {children}
        </TooltipMultipleContext.Provider>
    );
}

export type TooltipMultipleProps = {
    /**
     * Whether the tooltips are initially open.
     * @default false
     */
    defaultOpen?: boolean;
    /**
     * Callback when the shared open state changes.
     */
    onOpenChange?: (open: boolean, eventDetails: TooltipRoot.ChangeEventDetails) => void;
    /**
     * The tooltip roots to synchronize.
     */
    children?: React.ReactNode;
};

export namespace TooltipMultiple {
    export type Props = TooltipMultipleProps;
}
