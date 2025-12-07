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
};

type Context = undefined;

const selectors = {
    nested: createSelector((state: State) => state.nested),
    nestedListNumber: createSelector((state: State) => state.nestedListNumber),
    orientation: createSelector((state: State) => state.orientation),
    type: createSelector((state: State) => state.type)
};

export class ListStore extends ReactStore<State, Context, typeof selectors> {
    static create(initialState: State) {
        return new ListStore(initialState, undefined, selectors);
    }
}
