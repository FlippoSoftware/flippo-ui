import { effect, untracked } from '@flippo-software/store';

import { runOnceAnimationsFinish } from '~@dom/animations';
import { Connectable } from '~@lib/Connectable';
import { OptionsStore } from '~@lib/OptionsStore';
import { AnimationFrame } from '~@timers/AnimationFrame';

import type { PopupStoreState } from './popupStoreState';
import type { AnyPopupStore } from './popupTriggers';

export type PopupTransitionsOptions = {
    /**
     * Called after the popup is unmounted.
     */
    onUnmount?: () => void;
    /**
     * Wraps the unmount after exit animations. React adapters pass `ReactDOM.flushSync`.
     */
    flush?: (fn: () => void) => void;
};

/**
 * Manages the mounted state and the enter/exit transition status of a popup.
 *
 * Framework-agnostic replacement for `useTransitionStatus` + `useOpenChangeComplete`
 * (as used by `useOpenStateTransitions`):
 * - opening mounts the popup with `transitionStatus: 'starting'` and clears it on the next frame;
 * - closing sets `transitionStatus: 'ending'`, waits for the popup's animations to finish
 *   and then unmounts it (unless `preventUnmountingOnClose` is set).
 */
export class PopupTransitions<State extends PopupStoreState<unknown>> extends Connectable {
    private readonly frame = new AnimationFrame();

    private readonly animationFrame = new AnimationFrame();

    private abortController: AbortController | null = null;

    private readonly store: AnyPopupStore<State>;

    /**
     * The options, in a store: computed values and effects reading them follow their changes, key by key.
     */
    private readonly optionsStore = new OptionsStore<PopupTransitionsOptions>({} as PopupTransitionsOptions);

    private get options(): PopupTransitionsOptions {
        return this.optionsStore.state;
    }

    private set options(options: PopupTransitionsOptions) {
        this.optionsStore.setState(options);
    }

    private getOpen: () => boolean;

    private previousOpen: boolean | undefined;

    private stopWatchingOpen: (() => void) | null = null;

    constructor(store: AnyPopupStore<State>, options: PopupTransitionsOptions = {}) {
        super();
        this.store = store;
        this.options = options;
        this.getOpen = () => store.select('open');
    }

    public setOptions(options: PopupTransitionsOptions) {
        // What the machine reads while applying its options is not a dependency of the caller (e.g. an effect).
        untracked(() => {
            this.options = options;
        });
    }

    /**
     * Sets the open state to follow (e.g. a shared one from a group) and connects.
     *
     * @param getOpen Reads the open state to follow; defaults to the store's.
     * @returns The disconnect function.
     */
    public start(getOpen?: () => boolean): () => void {
        if (getOpen && getOpen !== this.getOpen) {
            this.getOpen = getOpen;
            if (this.connected) {
                // Follow the stores the new function reads.
                this.watchOpen();
            }
        }
        return this.connect();
    }

    protected override onConnect() {
        this.previousOpen = undefined;
        this.watchOpen();
        this.addCleanup(() => {
            this.stopWatchingOpen?.();
            this.stopWatchingOpen = null;
        });
    }

    /**
     * Follows `getOpen`: re-runs when a store it reads changes (e.g. the shared store of a tooltip group).
     */
    private watchOpen() {
        this.stopWatchingOpen?.();
        this.stopWatchingOpen = effect(() => {
            const next = this.getOpen();
            if (next !== this.previousOpen) {
                this.previousOpen = next;
                untracked(() => this.handleOpenChange(next));
            }
        });
    }

    /**
     * Unmounts the popup immediately, skipping exit animations.
     */
    public forceUnmount = () => {
        this.abort();
        this.store.update({
            activeTriggerId: null,
            activeTriggerElement: null,
            mounted: false,
            transitionStatus: undefined
        } as Partial<State>);
        this.options.onUnmount?.();
        this.store.context.onOpenChangeComplete?.(false);
    };

    protected override onDisconnect() {
        this.frame.cancel();
        this.abort();
    }

    private handleOpenChange(open: boolean) {
        const { mounted, transitionStatus } = this.store.state;

        if (open) {
            this.abort();

            if (!mounted) {
                this.store.update({ mounted: true, transitionStatus: 'starting' } as Partial<State>);
            }

            this.frame.request(() => {
                this.store.set('transitionStatus', undefined);
            });
            return;
        }

        this.frame.cancel();

        if (!mounted) {
            if (transitionStatus === 'ending') {
                this.store.set('transitionStatus', undefined);
            }
            return;
        }

        if (transitionStatus !== 'ending') {
            this.store.set('transitionStatus', 'ending');
        }

        if (this.store.select('preventUnmountingOnClose')) {
            return;
        }

        this.abort();
        const abortController = new AbortController();
        this.abortController = abortController;

        runOnceAnimationsFinish(
            this.store.context.popupRef.current,
            () => {
                if (!this.getOpen()) {
                    this.forceUnmount();
                }
            },
            {
                signal: abortController.signal,
                treatAbortedAsFinished: false,
                flush: this.options.flush,
                frame: this.animationFrame
            }
        );
    }

    private abort() {
        this.abortController?.abort();
        this.abortController = null;
        this.animationFrame.cancel();
    }
}
