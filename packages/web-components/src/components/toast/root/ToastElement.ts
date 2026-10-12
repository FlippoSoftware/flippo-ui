import { mergeProps } from '@flippo-software/core-components/props';
import { ToastRootMachine } from '@flippo-software/core-components/toast';
import { Store } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';
import type { ToastObject, ToastSwipeDirection } from '@flippo-software/core-components/toast';

import { declareProvider, provideContext } from '../../../lib/context';

import { ToastProviderPart, ToastRootContext } from './ToastRootContext';

/**
 * A toast. Its `toast` property is the toast object it shows (set by the viewport's template rendering, or by you).
 *
 * Attributes: `swipe-direction` (directions it is swiped away to: `up`, `down`, `left`, `right`, space-separated;
 * `down right` by default).
 * State attributes: `data-type`, `data-expanded`, `data-limited`, `data-swiping`, `data-swipe-direction`, transition
 * attributes.
 * CSS variables: `--toast-index`, `--toast-offset-y`, `--toast-swipe-movement-x`/`-y`…
 */
export class ToastElement extends ToastProviderPart.withAttributes({
    'swipe-direction': 'string'
}) {
    private root!: ToastRootMachine;

    private readonly toastValue = new Store<{ toast: ToastObject | undefined }>({ toast: undefined });

    private pendingReady: (() => void) | null = null;

    constructor() {
        super();
        declareProvider(this, ToastRootContext);
        // Set before the upgrade: an own property that shadows the accessor.
        if (Object.hasOwn(this, 'toast')) {
            const value = (this as { toast?: ToastObject }).toast;
            Reflect.deleteProperty(this, 'toast');
            this.toast = value;
        }
    }

    /**
     * The toast object shown.
     */
    get toast(): ToastObject | undefined {
        return this.toastValue.state.toast;
    }

    set toast(toast: ToastObject | undefined) {
        this.toastValue.set('toast', toast);
        this.invalidateOptions();
        if (toast && this.pendingReady) {
            const ready = this.pendingReady;
            this.pendingReady = null;
            ready();
        }
    }

    get machine(): ToastRootMachine {
        return this.root;
    }

    /**
     * After the provider: waits for its toast object.
     */
    protected override whenReady(callback: () => void) {
        super.whenReady(() => {
            if (this.toast) {
                callback();
            } else {
                this.pendingReady = callback;
            }
        });
    }

    override disconnectedCallback() {
        this.pendingReady = null;
        super.disconnectedCallback();
    }

    protected override createParts() {
        this.root = new ToastRootMachine(this.provider, this.getOptions());
    }

    protected override applyOptions() {
        this.root.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.root.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.root.connect();
        const stopProviding = provideContext(this, ToastRootContext, this);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.root?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.root.getRootProps(), ToastRootMachine.attrs(this.root.getState()));
    }

    private getOptions() {
        const directions = this.swipeDirection?.split(' ').filter(Boolean) as ToastSwipeDirection[] | undefined;
        return { toast: this.toast as ToastObject, swipeDirection: directions?.length ? directions : undefined };
    }
}
