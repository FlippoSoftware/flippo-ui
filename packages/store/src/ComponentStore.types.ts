// biome-ignore-all lint/suspicious/noExplicitAny: selector maps are heterogeneous by design.

/**
 * A selector registered in a `ComponentStore`: takes the state and up to three arguments.
 */
export type SelectorFunction<State> = (state: State, ...args: any[]) => any;

type Tail<T extends readonly unknown[]> = T extends readonly [unknown, ...infer Rest] ? Rest : [];

/**
 * The arguments of a selector after the state.
 */
export type SelectorArgs<S> = S extends (...params: infer Params) => unknown ? Tail<Params> : never;

/**
 * Typed `select(key, ...args)` method for a selector map.
 */
export type SelectMethod<Selectors extends Record<PropertyKey, SelectorFunction<any>>> = <Key extends keyof Selectors>(
    key: Key,
    ...args: SelectorArgs<Selectors[Key]>
) => ReturnType<Selectors[Key]>;

/**
 * A function selecting the value `observe` follows.
 */
export type ObserveSelector<State> = (state: State) => unknown;

type MaybeCallable = (...args: any[]) => any;

/**
 * Keys of the context whose values are functions (callbacks that adapters keep up to date).
 */
export type ContextFunctionKeys<Context> = {
    [Key in keyof Context]-?: Extract<Context[Key], MaybeCallable> extends never ? never : Key;
}[keyof Context];

/**
 * Keys of the state that accept `undefined`.
 */
export type KeysAllowingUndefined<State> = {
    [Key in keyof State]-?: undefined extends State[Key] ? Key : never;
}[keyof State];
