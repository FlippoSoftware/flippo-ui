import { onTestFinished } from 'vitest';

import type { Connectable } from '~@lib/Connectable';

/**
 * Connects `instance` (as an adapter does after mounting) and disconnects it when the test finishes.
 */
export function connected<T extends Connectable>(instance: T): T {
    instance.connect();
    onTestFinished(instance.disconnect);
    return instance;
}
