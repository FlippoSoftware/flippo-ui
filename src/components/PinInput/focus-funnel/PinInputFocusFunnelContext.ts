import React from 'react';

import type { PinInputFocusFunnel } from './PinInputFocusFunnel';

export type PinInputFocusFunnelContextValue = {
    focusMode: PinInputFocusFunnel.FocusMode;
};

export const PinInputFocusFunnelContext = React.createContext<PinInputFocusFunnelContextValue | undefined>(undefined);

export function usePinInputFocusFunnelContext(optional?: false): PinInputFocusFunnelContextValue;
export function usePinInputFocusFunnelContext(optional: true): PinInputFocusFunnelContextValue | undefined;
export function usePinInputFocusFunnelContext(optional?: boolean) {
    const context = React.use(PinInputFocusFunnelContext);

    if (context === undefined && !optional) {
        throw new Error('Headless UI: PinInputFocusFunnel is missing.');
    }

    return context;
}
