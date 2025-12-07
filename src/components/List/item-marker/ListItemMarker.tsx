import React from 'react';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, Orientation } from '~@lib/types';

import { useListItemContext } from '../item/ListItemContext';
import { useListRootContext } from '../root/ListRootContext';
import { useNestedListContext } from '../root/NestedListContext';

import type { ListRoot } from '../root/ListRoot';

export function ListItemMarker(componentProps: ListItemMarker.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        children: childrenProp,
        ...elementProps
    } = componentProps;

    const { store } = useListRootContext();
    const { nestedListItemNumber } = useNestedListContext();
    const { index } = useListItemContext();

    const nestedListNumber = store.useState('nestedListNumber');
    const orientation = store.useState('orientation');
    const type = store.useState('type');

    const marker = type === 'ordered' ? `${index + 1}.` : '•';

    const children = typeof childrenProp === 'function'
        ? childrenProp({
            index,
            nestedListNumber,
            nestedListItemNumber,
            orientation,
            type
        })
        : childrenProp ?? marker;

    const state: ListItemMarker.State = React.useMemo(() => ({
        index,
        nestedListNumber,
        nestedListItemNumber,
        orientation,
        type
    }), [
        index,
        nestedListNumber,
        nestedListItemNumber,
        orientation,
        type
    ]);

    const element = useRenderElement('div', componentProps, {
        ref,
        state,
        props: [elementProps, { children }]
    });

    return element;
}

export namespace ListItemMarker {
    type ChildrenProps = {
        index: number;
        nestedListNumber: number;
        nestedListItemNumber: number;
        orientation: Orientation;
        type: ListRoot.State['type'];
    };

    export type State = ChildrenProps;

    export type Props = {
        children: React.ReactNode | ((props: ChildrenProps) => React.ReactNode);
    } & HeadlessUIComponentProps<'div', State>;
}
