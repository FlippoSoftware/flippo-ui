import React from 'react';

import type { FocusManager } from '@flippo-software/core-components/floating';

import { FocusGuard } from '~@lib/FocusGuard';

import type { Subscribable } from '~@lib/core';

const getServerSnapshot = () => null;

/**
 * Renders the focus guards of a core `FocusManager` around the floating content (replacement for the
 * markup of `FloatingFocusManager`).
 *
 * The focus manager is created when the popup machine connects; the guards are re-evaluated on changes of `store`.
 */
export function FocusGuards(props: FocusGuards.Props) {
    const { store, getFocusManager, children } = props;

    const getSnapshot = React.useCallback(() => {
        const focusManager = getFocusManager();
        return focusManager?.shouldRenderGuards() ? focusManager : null;
    }, [getFocusManager]);
    const focusManager = React.useSyncExternalStore(store.subscribe, getSnapshot, getServerSnapshot);

    return (
        <React.Fragment>
            {focusManager && (
                <FocusGuard
                    data-type='inside'
                    ref={focusManager.setBeforeGuard}
                    onFocus={(event) => focusManager.onBeforeGuardFocus(event.nativeEvent)}
                />
            )}
            {children}
            {focusManager && (
                <FocusGuard
                    data-type='inside'
                    ref={focusManager.setAfterGuard}
                    onFocus={(event) => focusManager.onAfterGuardFocus(event.nativeEvent)}
                />
            )}
        </React.Fragment>
    );
}

export namespace FocusGuards {
    export type Props = {
        /**
         * The store whose changes may change whether the guards are rendered.
         */
        store: Subscribable;
        /**
         * Reads the current focus manager (`null` while the popup is not connected).
         */
        getFocusManager: () => FocusManager | null;
        children?: React.ReactNode;
    };
}
