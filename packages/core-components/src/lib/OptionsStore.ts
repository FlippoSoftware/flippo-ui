import { Store } from '@flippo-software/store';

/**
 * The options of a machine. A store, so that the computed values and effects of the machine (and the web
 * components) follow option changes, key by key.
 *
 * A separate class so that framework adapters that push the options on every render (the React components) can
 * ignore it in their subscriptions: the component already re-renders with its own props, and options like callbacks
 * are new on every render.
 */
export class OptionsStore<Options> extends Store<Options> {}

/**
 * Whether `source` holds the options of a machine.
 */
export function isOptionsStore(source: unknown): source is OptionsStore<unknown> {
    return source instanceof OptionsStore;
}
