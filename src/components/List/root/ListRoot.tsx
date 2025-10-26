import React from 'react';

import { useLazyRef } from '@flippo-ui/hooks';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, HTMLProps, Orientation } from '~@lib/types';

import { CompositeList } from '../../Composite';
import { ListStore } from '../store';

import { ListRootContext, useListRootContext } from './ListRootContext';
import { useNestedListContext } from './NestedListContext';

import type { ListRootContextValue } from './ListRootContext';

const INITIAL_STATE = {
    nested: false,
    nestedListNumber: 1,
    orientation: 'vertical',
    type: 'ordered'
} as const;

/**
 * Root container for the List component with full state management.
 * Renders a `<div>` element by default.
 */
export function ListRoot(componentProps: ListRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        orientation = 'vertical',
        type = 'ordered',
        ref,
        ...elementProps
    } = componentProps;

    const elementsRef = React.useRef<(HTMLElement | null)[]>([]);

    const parentListRootContext = useListRootContext(true);
    const nesting = useNestedListContext();

    const nested = Boolean(parentListRootContext);
    const nestedListNumber = (parentListRootContext?.store.useState('nestedListNumber') ?? 0) + 1;
    const nestedListItemNumber = nesting?.nestedListItemNumber ?? undefined;

    const store = useLazyRef(ListStore.create, INITIAL_STATE).current;

    store.useSyncedValues({
        nested,
        nestedListNumber,
        orientation,
        type
    });

    const state: ListRoot.State = React.useMemo(() => ({
        orientation,
        nestedListNumber,
        nestedListItemNumber,
        nested,
        type
    }), [
        orientation,
        nestedListNumber,
        nestedListItemNumber,
        nested,
        type
    ]);

    const listProps = React.useMemo<HTMLProps>(() => ({
        'role': 'list',
        'aria-labelledby': nesting?.subheaderId ? nesting.subheaderId : undefined
    }), [nesting]);

    const element = useRenderElement('div', componentProps, {
        ref,
        state,
        props: [elementProps, listProps]
    });

    const contextValue: ListRootContextValue = React.useMemo(() => ({ store }), [store]);

    return (
        <ListRootContext value={contextValue}>
            <CompositeList elementsRef={elementsRef}>
                {element}
            </CompositeList>
        </ListRootContext>
    );
}

export namespace ListRoot {
    export type State = {
        /**
         * Layout orientation.
         */
        orientation: Orientation;
        /**
         * Whether the list is nested.
         */
        nested: boolean;
        /**
         * Nested list number.
         */
        nestedListNumber: number;
        /**
         * Nested list item number.
         */
        nestedListItemNumber: number | undefined;
        /**
         * List type.
         */
        type: 'ordered' | 'unordered';
    };

    export type Props = HeadlessUIComponentProps<'div', State> & {
        /**
         * Layout orientation.
         */
        orientation: Orientation;
        /**
         * The type of the list.
         *
         * @default 'ordered'
         */
        type?: 'ordered' | 'unordered';
    };
}
