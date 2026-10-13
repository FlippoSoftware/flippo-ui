import { Store, untracked } from '@flippo-software/store';

import { Connectable } from '~@lib/Connectable';
import { OptionsStore } from '~@lib/OptionsStore';
import { AnimationFrame } from '~@timers/AnimationFrame';

import type { TransitionStatus } from '~@lib/types';

export type TransitionStatusState = {
    mounted: boolean;
    transitionStatus: TransitionStatus;
};

export type TransitionStatusOptions = {
    /**
     * Enables the `'idle'` state between `'starting'` and `'ending'`.
     * @default false
     */
    enableIdleState?: boolean | undefined;
    /**
     * Sets `'ending'` on the next frame instead of synchronously.
     * @default false
     */
    deferEndingState?: boolean | undefined;
};

/**
 * Status of enter/exit CSS transitions for an element that mounts while open.
 * Framework-agnostic replacement for `useTransitionStatus`: `setOpen(open)` drives it, `setMounted(false)`
 * unmounts after the exit animation (see `runOnceAnimationsFinish`).
 */
export class TransitionStatusController extends Connectable {
    readonly store: Store<TransitionStatusState>;

    /**
     * The options, in a store: computed values and effects reading them follow their changes, key by key.
     */
    private readonly optionsStore = new OptionsStore<TransitionStatusOptions>({} as TransitionStatusOptions);

    private get options(): TransitionStatusOptions {
        return this.optionsStore.state;
    }

    private set options(options: TransitionStatusOptions) {
        this.optionsStore.setState(options);
    }

    private open: boolean;

    private readonly frame = new AnimationFrame();

    /**
     * @param open Whether the element is initially open.
     * @param options Transition options.
     * @param store Where to keep `mounted` and `transitionStatus`, e.g. the store of the component that owns the
     *   element, so that they don't have to be copied there. Defaults to a store of its own.
     */
    constructor(open: boolean, options: TransitionStatusOptions = {}, store?: Store<TransitionStatusState>) {
        super();
        this.options = options;
        this.open = open;
        const initial: TransitionStatusState = {
            mounted: open,
            transitionStatus: open && options.enableIdleState ? 'idle' : undefined
        };
        if (store) {
            store.update(initial);
            this.store = store;
        } else {
            this.store = new Store<TransitionStatusState>(initial);
        }
    }

    protected override onConnect() {
        this.scheduleFrame();
    }

    get state() {
        return this.store.state;
    }

    setOptions(options: TransitionStatusOptions) {
        // What the machine reads while applying its options is not a dependency of the caller (e.g. an effect).
        untracked(() => {
            this.options = options;
            this.sync();
        });
    }

    setOpen(open: boolean) {
        if (open === this.open) {
            return;
        }
        this.open = open;
        this.sync();
    }

    setMounted = (mounted: boolean) => {
        this.store.set('mounted', mounted);
        this.sync();
    };

    protected override onDisconnect() {
        this.frame.cancel();
    }

    private sync() {
        const { enableIdleState = false, deferEndingState = false } = this.options;
        const open = this.open;
        const { mounted, transitionStatus } = this.store.state;

        if (open && !mounted) {
            this.store.update({ mounted: true, transitionStatus: 'starting' });
        } else if (!open && mounted && transitionStatus !== 'ending' && !deferEndingState) {
            this.store.set('transitionStatus', 'ending');
        } else if (!open && !mounted && transitionStatus === 'ending') {
            this.store.set('transitionStatus', undefined);
        }

        if (enableIdleState && open && this.store.state.mounted && this.store.state.transitionStatus !== 'idle') {
            this.store.set('transitionStatus', 'starting');
        }

        this.scheduleFrame();
    }

    private scheduleFrame() {
        const { enableIdleState = false, deferEndingState = false } = this.options;
        const open = this.open;
        const { mounted, transitionStatus } = this.store.state;

        this.frame.cancel();
        if (!this.connected) {
            return;
        }

        if (!open && mounted && transitionStatus !== 'ending' && deferEndingState) {
            this.frame.request(() => this.store.set('transitionStatus', 'ending'));
            return;
        }

        if (open && !enableIdleState) {
            // Avoid synchronous flushing here due to Firefox: https://github.com/mui/base-ui/pull/3424
            this.frame.request(() => this.store.set('transitionStatus', undefined));
            return;
        }

        if (open && enableIdleState) {
            this.frame.request(() => this.store.set('transitionStatus', 'idle'));
        }
    }
}
