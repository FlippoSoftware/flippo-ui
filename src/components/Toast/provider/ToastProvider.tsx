import React from 'react';

import { ToastProviderMachine } from '@flippo-software/core-components/toast';

import { useMachine, useStoreState } from '~@lib/core';

import type { createToastManager } from '../createToastManager';

import { ToastContext } from './ToastProviderContext';

import type { ToastContextValue } from './ToastProviderContext';

/**
 * Provides a context for creating and managing toasts.
 *
 * Documentation: [Base UI Toast](https://base-ui.com/react/components/toast)
 */
export function ToastProvider(props: ToastProvider.Props) {
    const { children, timeout = 5000, limit = 3, toastManager } = props;

    const provider = useMachine((options) => new ToastProviderMachine(options), { timeout, limit, toastManager });
    const state = useStoreState(provider.store);

    const contextValue: ToastContextValue<any> = React.useMemo(
        () => ({
            provider,
            toasts: state.toasts as ToastContextValue<any>['toasts'],
            hovering: state.hovering,
            focused: state.focused,
            prevFocusElement: state.prevFocusElement,
            hasDifferingHeights: provider.hasDifferingHeights,
            setToasts: (updater) =>
                provider.setToasts((toasts) => (typeof updater === 'function' ? (updater(toasts as never) as never) : (updater as never))),
            setHovering: (value) => provider.setHovering(typeof value === 'function' ? value(provider.store.state.hovering) : value),
            setFocused: (value) => provider.setFocused(typeof value === 'function' ? value(provider.store.state.focused) : value),
            setPrevFocusElement: (value) =>
                provider.setPrevFocusElement(typeof value === 'function' ? value(provider.store.state.prevFocusElement) : value),
            add: provider.add,
            update: provider.update,
            promise: provider.promise as ToastContextValue<any>['promise'],
            close: provider.close,
            remove: provider.remove,
            pauseTimers: provider.pauseTimers,
            resumeTimers: provider.resumeTimers,
            scheduleTimer: provider.scheduleTimer,
            viewportRef: provider.viewportRef as React.RefObject<HTMLElement | null>,
            windowFocusedRef: provider.windowFocusedRef as React.RefObject<boolean>
        }),
        [provider, state]
    );

    return <ToastContext value={contextValue}>{children}</ToastContext>;
}

export namespace ToastProvider {
    export type Props = {
        children?: React.ReactNode;
        /**
         * The default amount of time (in ms) before a toast is auto dismissed.
         * A value of `0` will prevent the toast from being dismissed automatically.
         * @default 5000
         */
        timeout?: number;
        /**
         * The maximum number of toasts that can be displayed at once.
         * When the limit is reached, the oldest toast will be removed to make room for the new one.
         * @default 3
         */
        limit?: number;
        /**
         * A global manager for toasts to use outside of a React component.
         */
        toastManager?: createToastManager.ToastManager;
    };
}
