/**
 * Anything with a core `Store`-like subscription.
 */
export type Subscribable = {
    subscribe(listener: () => void): () => void;
};

/**
 * Keeps one subscription per source, for a set of sources that changes over time.
 */
export class SourceSubscriptions {
    private readonly active = new Map<Subscribable, () => void>();

    private readonly listener: () => void;

    constructor(listener: () => void) {
        this.listener = listener;
    }

    /**
     * Subscribes to the sources that are new and unsubscribes from the ones that are gone.
     */
    sync(sources: Iterable<Subscribable>) {
        const next = new Set(sources);
        for (const [source, unsubscribe] of this.active) {
            if (!next.has(source)) {
                unsubscribe();
                this.active.delete(source);
            }
        }
        for (const source of next) {
            if (!this.active.has(source)) {
                this.active.set(source, source.subscribe(this.listener));
            }
        }
    }

    clear() {
        for (const unsubscribe of this.active.values()) {
            unsubscribe();
        }
        this.active.clear();
    }
}
