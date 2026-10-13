import { Store, untracked } from '@flippo-software/store';

import { Connectable } from '~@lib/Connectable';
import { Timeout } from '~@timers/Timeout';

import type { ImageLoadingStatus } from '../root/AvatarMachine';

/**
 * Delay before the avatar fallback may be shown.
 */
export class AvatarFallbackDelay extends Connectable {
    readonly store: Store<{ delayPassed: boolean }>;

    private readonly timeout = new Timeout();

    private delay: number | undefined;

    constructor(delay: number | undefined) {
        super();
        this.store = new Store({ delayPassed: delay === undefined });
        this.delay = delay;
    }

    protected override onConnect() {
        this.setDelay(this.delay);
    }

    /**
     * Restarts the delay only when it changed, so it can be called on every render.
     */
    setOptions(options: { delay?: number | undefined }) {
        // What the machine reads while applying its options is not a dependency of the caller (e.g. an effect).
        untracked(() => {
            if (options.delay !== this.delay) {
                this.setDelay(options.delay);
            }
        });
    }

    setDelay(delay: number | undefined) {
        this.delay = delay;
        this.timeout.clear();
        if (this.connected && delay !== undefined && !this.store.state.delayPassed) {
            this.timeout.start(delay, () => this.store.set('delayPassed', true));
        }
    }

    /**
     * Whether the fallback is rendered.
     */
    isRendered(imageLoadingStatus: ImageLoadingStatus) {
        return imageLoadingStatus !== 'loaded' && this.store.state.delayPassed;
    }

    protected override onDisconnect() {
        this.timeout.clear();
    }
}
