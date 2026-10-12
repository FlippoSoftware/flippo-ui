import { requestContexts } from './context';
import { MachineElement } from './MachineElement';

import type { Context, ContextValues } from './context';

/**
 * Base class of the parts of compound components: the element waits until the contexts it needs (`contexts`) are
 * provided by its ancestors (e.g. the root of the component) before it creates its machines, and keeps their values
 * in `provided`.
 *
 * @example
 * const COLLAPSIBLE = [CollapsibleContext] as const;
 *
 * abstract class CollapsiblePart extends ContextPart<typeof COLLAPSIBLE> {
 *     protected readonly contexts = COLLAPSIBLE;
 *
 *     protected get collapsible() {
 *         return this.provided[0];
 *     }
 * }
 */
export abstract class ContextPart<Contexts extends readonly Context<unknown>[]> extends MachineElement {
    /**
     * The contexts the part needs, in order.
     */
    protected abstract readonly contexts: Contexts;

    /**
     * The values of the contexts, in order. Set before `createParts`.
     */
    protected provided!: ContextValues<Contexts>;

    private cancelRequest: (() => void) | null = null;

    protected override whenReady(callback: () => void) {
        this.cancelRequest?.();
        this.cancelRequest = requestContexts(this, this.contexts, (values) => {
            this.cancelRequest = null;
            this.provided = values;
            callback();
        });
    }

    override disconnectedCallback() {
        this.cancelRequest?.();
        this.cancelRequest = null;
        super.disconnectedCallback();
    }
}
