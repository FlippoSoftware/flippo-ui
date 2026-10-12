/**
 * A key for a value provided by an element to its descendants (e.g. the root machine of a compound component).
 */
export type Context<Value> = {
    readonly name: string;
    /**
     * Only carries the type.
     */
    readonly __value?: Value;
};

export function createContext<Value>(name: string): Context<Value> {
    return { name } as Context<Value>;
}

/**
 * The `context-request` event of the Context Community Protocol
 * (https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md): a consumer dispatches it,
 * and the closest provider of the context answers by calling `callback`.
 */
export class ContextRequestEvent<Value> extends Event {
    readonly context: Context<Value>;

    readonly contextTarget: Element;

    readonly callback: (value: Value) => void;

    readonly subscribe = false;

    constructor(context: Context<Value>, contextTarget: Element, callback: (value: Value) => void) {
        super('context-request', { bubbles: true, composed: true });
        this.context = context;
        this.contextTarget = contextTarget;
        this.callback = callback;
    }
}

/**
 * The parent of `node`, across shadow roots (the host of a shadow root).
 */
function getParent(node: Node): Element | null {
    if (node.parentElement) {
        return node.parentElement;
    }
    const root = node.getRootNode();
    return root !== node && 'host' in root ? (root as ShadowRoot).host : null;
}

/**
 * The contexts each element will provide, declared before it is ready to (see {@link declareProvider}).
 */
const declaredProviders = new WeakMap<Element, Set<Context<unknown>>>();

/**
 * Declares that `element` will provide `context`, before it can (e.g. while it waits for a context itself). Requests
 * from its descendants are then left to it: an outer provider of the same context does not answer them.
 */
export function declareProvider(element: Element, context: Context<unknown>) {
    let contexts = declaredProviders.get(element);
    if (!contexts) {
        contexts = new Set();
        declaredProviders.set(element, contexts);
    }
    contexts.add(context);
}

/**
 * A test for the elements that declare that they provide `context` (see {@link declareProvider}): an ancestor type for
 * {@link requestAncestorContext} that needs no import of their classes.
 */
export function providesContext(context: Context<unknown>): (node: Element) => boolean {
    return (node) => declaredProviders.get(node)?.has(context) ?? false;
}

/**
 * Whether an element between `requester` and `provider` will provide `context` itself: then it is the closest
 * provider, not `provider`.
 */
function isShadowedProvider(requester: Element, provider: Element, context: Context<unknown>): boolean {
    for (let node = getParent(requester); node && node !== provider; node = getParent(node)) {
        if (declaredProviders.get(node)?.has(context)) {
            return true;
        }
    }
    return false;
}

type PendingRequest = {
    readonly element: Element;
    readonly context: Context<unknown>;
    readonly callback: (value: unknown) => void;
};

/**
 * Requests that no provider has answered yet: providers may connect after their descendants (e.g. when they are
 * defined later). A provider that connects answers the pending requests of its descendants.
 */
const pending = new Set<PendingRequest>();

/**
 * Requests `context` from the ancestors of `element`. `callback` is called once, now or when a provider connects.
 *
 * @returns A function that cancels a request that is still pending.
 */
export function requestContext<Value>(element: Element, context: Context<Value>, callback: (value: Value) => void): () => void {
    let answered = false;
    const answer = (value: Value) => {
        if (!answered) {
            answered = true;
            callback(value);
        }
    };
    element.dispatchEvent(new ContextRequestEvent(context, element, answer));
    if (answered) {
        return () => {};
    }
    const request: PendingRequest = { element, context: context as Context<unknown>, callback: answer as (value: unknown) => void };
    pending.add(request);
    return () => {
        pending.delete(request);
    };
}

/**
 * Makes `element` provide `value` for `context` to its descendants, and answers their pending requests.
 *
 * @returns A function that stops providing.
 */
export function provideContext<Value>(element: Element, context: Context<Value>, value: Value): () => void {
    const onRequest = (event: Event) => {
        const request = event as ContextRequestEvent<Value>;
        if (
            request.context !== context ||
            request.contextTarget === element ||
            isShadowedProvider(request.contextTarget, element, context as Context<unknown>)
        ) {
            return;
        }
        event.stopPropagation();
        request.callback(value);
    };
    element.addEventListener('context-request', onRequest);

    for (const request of pending) {
        if (
            request.context === (context as Context<unknown>) &&
            element.contains(request.element) &&
            !isShadowedProvider(request.element, element, request.context)
        ) {
            pending.delete(request);
            request.callback(value);
        }
    }

    return () => element.removeEventListener('context-request', onRequest);
}

/**
 * The values of a list of contexts.
 */
export type ContextValues<Contexts extends readonly Context<unknown>[]> = {
    [Index in keyof Contexts]: Contexts[Index] extends Context<infer Value> ? Value : never;
};

/**
 * Requests several contexts; `callback` is called once all of them are provided.
 *
 * @returns A function that cancels the requests that are still pending.
 */
export function requestContexts<const Contexts extends readonly Context<unknown>[]>(
    element: Element,
    contexts: Contexts,
    callback: (values: ContextValues<Contexts>) => void
): () => void {
    const values: unknown[] = [];
    let cancel: () => void = () => {};
    const next = (index: number) => {
        const context = contexts[index];
        if (!context) {
            callback(values as ContextValues<Contexts>);
            return;
        }
        cancel = requestContext(element, context, (value) => {
            values[index] = value;
            next(index + 1);
        });
    };
    next(0);
    return () => cancel();
}

/**
 * Returns the value of `context` if an ancestor of `element` provides it now; unlike {@link requestContext}, does not
 * wait for a provider. For optional contexts, e.g. the parent of a nested component.
 */
export function queryContext<Value>(element: Element, context: Context<Value>): Value | undefined {
    let found: Value | undefined;
    element.dispatchEvent(
        new ContextRequestEvent(context, element, (value) => {
            found = value;
        })
    );
    return found;
}

/**
 * The elements that provide a context: a class, or a test for elements of several classes.
 */
// biome-ignore lint/suspicious/noExplicitAny: any element class, whatever its constructor.
export type AncestorType = (abstract new (...args: any[]) => Element) | ((node: Element) => boolean);

function isAncestorOfType(node: Element, type: AncestorType): boolean {
    return 'prototype' in type && type.prototype instanceof Element ? node instanceof type : (type as (node: Element) => boolean)(node);
}

/**
 * Optional contexts provided by ancestors of given types: `callback` gets their values (`undefined` for the ones without
 * such an ancestor) once all are known. See {@link requestAncestorContext}.
 *
 * @returns A function that cancels the requests that are still pending.
 */
export function requestAncestorContexts<const Requests extends readonly (readonly [Context<unknown>, AncestorType])[]>(
    element: Element,
    requests: Requests,
    callback: (values: { [Index in keyof Requests]: Requests[Index][0] extends Context<infer Value> ? Value | undefined : never }) => void
): () => void {
    const values: unknown[] = [];
    let cancel: () => void = () => {};
    const next = (index: number) => {
        const request = requests[index];
        if (!request) {
            callback(values as never);
            return;
        }
        cancel = requestAncestorContext(element, request[0], request[1], (value) => {
            values[index] = value;
            next(index + 1);
        });
    };
    next(0);
    return () => cancel();
}

/**
 * For contexts provided by an ancestor of a given type, when there may be none (e.g. the parent of a nested component):
 * calls `callback` with the value once that ancestor provides it, or right away with `undefined` when `element` has no
 * such ancestor. Unlike {@link queryContext}, it does not depend on the order elements connect in (a parent may connect
 * after its children).
 *
 * @returns A function that cancels a request that is still pending.
 */
export function requestAncestorContext<Value>(
    element: Element,
    context: Context<Value>,
    ancestorType: AncestorType,
    callback: (value: Value | undefined) => void
): () => void {
    for (let node = getParent(element); node; node = getParent(node)) {
        if (isAncestorOfType(node, ancestorType)) {
            return requestContext(element, context, callback);
        }
    }
    callback(undefined);
    return () => {};
}
