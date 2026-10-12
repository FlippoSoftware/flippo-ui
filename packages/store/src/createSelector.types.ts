// biome-ignore-all lint/suspicious/noExplicitAny: selector inference relies on `any` in generic constraints.

/**
 * A function that derives a value from the state and up to three extra arguments.
 */
export type Selector<State = any, Result = unknown, Params extends readonly any[] = any[]> = (state: State, ...params: Params) => Result;

/**
 * Any selector or combiner, as the implementations see them.
 */
export type AnySelector = (...args: any[]) => any;

type StateFromSelectorList<Selectors extends readonly any[]> = Selectors extends [f: infer F, ...other: infer R]
    ? StateFromSelector<F> extends StateFromSelectorList<R>
        ? StateFromSelector<F>
        : StateFromSelectorList<R>
    : object;

type StateFromSelector<T> = T extends (first: infer F, ...args: any[]) => any ? F : never;

type DropFirst<T> = T extends [any, ...infer Xs] ? Xs : [];

type ReturnTypes<FunctionsArray extends readonly AnySelector[]> = {
    [Index in keyof FunctionsArray]: FunctionsArray[Index] extends FunctionsArray[number] ? ReturnType<FunctionsArray[Index]> : never;
};

type MergeParams<STypes extends readonly unknown[], CTypes extends readonly unknown[]> = STypes['length'] extends 0
    ? CTypes
    : MergeParams<DropFirst<STypes>, DropFirst<CTypes>>;

/**
 * The signature of `createSelector` and `createSelectorMemoized`: input selectors and a combiner whose parameters are
 * their results, then the extra arguments.
 */
export type CreateSelectorFunction = <
    const Args extends any[],
    const Selectors extends readonly Selector<any>[],
    const Combiner extends (...args: readonly [...ReturnTypes<Selectors>, ...Args]) => any
>(
    ...items: [...Selectors, Combiner]
) => (
    ...args: Selectors['length'] extends 0
        ? MergeParams<ReturnTypes<Selectors>, Parameters<Combiner>>
        : [StateFromSelectorList<Selectors>, ...MergeParams<ReturnTypes<Selectors>, Parameters<Combiner>>]
) => ReturnType<Combiner>;
