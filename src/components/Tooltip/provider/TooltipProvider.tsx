import React from 'react';

import { FloatingDelayGroup } from '~@packages/floating-ui-react';

import { TooltipProviderContext } from './TooltipProviderContext';

import type { TooltipProviderContextValue } from './TooltipProviderContext';

export function TooltipProvider(props: TooltipProviderProps) {
    const {
        delay,
        closeDelay,
        timeout = 400
    } = props;

    const contextValue: TooltipProviderContextValue = React.useMemo(
        () => ({
            delay,
            closeDelay
        }),
        [delay, closeDelay]
    );

    const delayValue = React.useMemo(() => ({ open: delay, close: closeDelay }), [delay, closeDelay]);

    return (
        <TooltipProviderContext.Provider value={contextValue}>
            <FloatingDelayGroup delay={delayValue} timeoutMs={timeout}>
                {props.children}
            </FloatingDelayGroup>
        </TooltipProviderContext.Provider>
    );
}

export type TooltipProviderProps = {
    children?: React.ReactNode;
    /**
     * How long to wait before opening a tooltip. Specified in milliseconds.
     */
    delay?: number;
    /**
     * How long to wait before closing a tooltip. Specified in milliseconds.
     */
    closeDelay?: number;
    /**
     * Another tooltip will open instantly if the previous tooltip
     * is closed within this timeout. Specified in milliseconds.
     * @default 400
     */
    timeout?: number;
};

export namespace TooltipProvider {
    export type Props = TooltipProviderProps;
}
