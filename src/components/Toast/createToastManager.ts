import { ToastManager } from '@flippo-software/core-components/toast';

import type { ToastManager as CoreToastManager, ToastManagerEvent as CoreToastManagerEvent } from '@flippo-software/core-components/toast';

export type ToastManagerEvent = CoreToastManagerEvent;

/**
 * Creates a new toast manager.
 */
export function createToastManager(): createToastManager.ToastManager {
    return new ToastManager();
}

export namespace createToastManager {
    /**
     * A toast manager usable outside of React; pass it to `Toast.Provider` to connect them.
     */
    export type ToastManager = CoreToastManager;
}
