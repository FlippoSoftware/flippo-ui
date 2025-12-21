import React from 'react';

import { CompositeTooltipList } from '../composite';

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
    const {
        open = false,
        defaultOpen = false,
        onOpenChange,
        disabled,
        delay,
        closeDelay,
        children
    } = props;

    const store = TooltipMultipleStore.useStore(open ?? defaultOpen);
    const elementsRef = React.useRef<(HTMLElement | null)[]>([]);

    store.useContextCallback('onOpenChange', onOpenChange);

    const contextValue = React.useMemo(
        () => ({
            store,
            disabled,
            delay,
            closeDelay
        }),
        [store, disabled, delay, closeDelay]
    );

    return (
        <TooltipMultipleContext value={contextValue}>
            <CompositeTooltipList elementsRef={elementsRef}>
                {children}
            </CompositeTooltipList>
        </TooltipMultipleContext>
    );
}

export type TooltipMultipleProps = {
    /**
     * Whether the tooltips are open.
     * @default false
     */
    open?: boolean;
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
     * Whether all tooltips in the group are disabled.
     * Individual triggers can override this.
     */
    disabled?: boolean;
    /**
     * Common open delay for all triggers in the group (in milliseconds).
     * Individual triggers can override this.
     */
    delay?: number;
    /**
     * Common close delay for all triggers in the group (in milliseconds).
     * Individual triggers can override this.
     */
    closeDelay?: number;
    /**
     * The tooltip roots to synchronize.
     */
    children?: React.ReactNode;
};

export namespace TooltipMultiple {
    export type Props = TooltipMultipleProps;
}
