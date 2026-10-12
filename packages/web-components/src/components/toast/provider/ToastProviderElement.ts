import { ToastProviderMachine } from '@flippo-software/core-components/toast';

import type { Props } from '@flippo-software/core-components/props';
import type {
    ToastAddOptions,
    ToastManager,
    ToastObject,
    ToastPromiseOptions,
    ToastUpdateOptions
} from '@flippo-software/core-components/toast';

import { declareProvider, provideContext } from '../../../lib/context';
import { MachineElement, property } from '../../../lib/MachineElement';
import { ToastProviderContext } from '../root/ToastRootContext';

/**
 * Holds the toasts: add them with its methods (`add`, `update`, `close`, `promise`) or with a toast manager
 * (`createToastManager()`), shown by the `<prefix>-toast-viewport` in it.
 *
 * Attributes: `timeout` (ms before a toast closes; 5000, 0 to keep it), `limit` (toasts shown at once; 3).
 * Properties: `toastManager` (to add toasts from anywhere), `toasts` (read-only: the current toasts).
 * Events: `toasts-change` (`detail: { toasts }`), for frameworks rendering the toasts themselves.
 */
export class ToastProviderElement extends MachineElement.withAttributes({
    timeout: 'number',
    limit: 'number',
    toastManager: property<ToastManager>()
}) {
    private provider!: ToastProviderMachine;

    constructor() {
        super();
        declareProvider(this, ToastProviderContext);
    }

    get machine(): ToastProviderMachine {
        return this.provider;
    }

    /**
     * The current toasts.
     */
    get toasts(): readonly ToastObject[] {
        return this.provider?.store.state.toasts ?? [];
    }

    /**
     * Adds a toast. Returns its id.
     */
    add<Data extends object>(options: ToastAddOptions<Data>): string {
        return this.provider.add(options);
    }

    update<Data extends object>(id: string, updates: ToastUpdateOptions<Data>) {
        this.provider.update(id, updates);
    }

    close(id: string) {
        this.provider.close(id);
    }

    /**
     * A toast that follows a promise: loading, then success or error.
     */
    promise<Value, Data extends object>(promiseValue: Promise<Value>, options: ToastPromiseOptions<Value, Data>): Promise<Value> {
        return this.provider.promise(promiseValue, options);
    }

    protected override createParts() {
        this.provider = new ToastProviderMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.provider.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.provider.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.provider.connect();
        const stopProviding = provideContext(this, ToastProviderContext, this);
        let previous = this.provider.store.state.toasts;
        const stopNotifying = this.provider.store.subscribe(({ toasts }) => {
            if (toasts !== previous) {
                previous = toasts;
                this.emit('toasts-change', { toasts });
            }
        });
        return () => {
            stopNotifying();
            stopProviding();
            disconnect();
        };
    }

    protected override getProps(): Props {
        return {};
    }

    private getOptions() {
        return { timeout: this.timeout ?? 5000, limit: this.limit ?? 3, toastManager: this.toastManager };
    }
}
