import { createSelector, ReactStore } from '@flippo-ui/hooks';

import type { Orientation } from '~@lib/types';

export type State = {

    /**
     * Determines if the list is nested within a parent list.
     */
    nested: boolean;
    /**
     * Number of nested lists that are currently.
     */
    nestedListNumber: number;
    /**
     * Layout orientation.
     */
    orientation: Orientation;

    /**
     * List type.
     */
    type: 'ordered' | 'unordered';

    /**
     * Whether the items are being externally virtualized.
     * When `true`, items should pass their `index` prop explicitly
     * and CompositeList is not used.
     */
    virtualized: boolean;

    /**
     * A ref to the list of HTML elements, ordered by their index.
     */
    elementsRef: React.RefObject<(HTMLElement | null)[]>;
};

type Context = undefined;

const selectors = {
    nested: createSelector((state: State) => state.nested),
    nestedListNumber: createSelector((state: State) => state.nestedListNumber),
    orientation: createSelector((state: State) => state.orientation),
    type: createSelector((state: State) => state.type),
    virtualized: createSelector((state: State) => state.virtualized),
    elementsRef: createSelector((state: State) => state.elementsRef)
};

export class ListStore extends ReactStore<State, Context, typeof selectors> {
    static create(initialState: State) {
        return new ListStore(initialState, undefined, selectors);
    }
}
