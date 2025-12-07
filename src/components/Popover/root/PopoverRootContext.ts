import React from 'react';

import type { PopoverStore } from '../store/PopoverStore';

export type PopoverRootContextValue<Payload = unknown> = {
    store: PopoverStore<Payload>;
};

export const PopoverRootContext = React.createContext<PopoverRootContextValue | undefined>(undefined);

export function usePopoverRootContext(optional?: false): PopoverRootContextValue;
export function usePopoverRootContext(optional: true): PopoverRootContextValue | undefined;
export function usePopoverRootContext(optional?: boolean) {
    const context = React.use(PopoverRootContext);
    if (context === undefined && !optional) {
        throw new Error(
            'Headless UI: PopoverRootContext is missing. Popover parts must be placed within <Popover.Root>.'
        );
    }

    return context;
}
