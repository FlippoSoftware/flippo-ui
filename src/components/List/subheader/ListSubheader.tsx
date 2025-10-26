import React from 'react';

import { useIsoLayoutEffect } from '@flippo-ui/hooks';

import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, Orientation } from '~@lib/types';

import { useListItemContext } from '../item/ListItemContext';
import { useListRootContext } from '../root/ListRootContext';
import { useNestedListContext } from '../root/NestedListContext';

export function ListSubheader<Tag extends ListSubheader.ElementType>(componentProps: ListSubheader.Props<Tag>) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        id: idProp,
        tag = 'h3',
        ref,
        ...elementProps
    } = componentProps;

    const { store } = useListRootContext();
    const { nestedListItemNumber } = useNestedListContext();
    const { index, setSubheaderId } = useListItemContext();

    const id = useHeadlessUiId(idProp);
    const orientation = store.useState('orientation');
    const nestedListNumber = store.useState('nestedListNumber');
    const type = store.useState('type');

    useIsoLayoutEffect(() => {
        setSubheaderId(id);

        return () => {
            setSubheaderId(undefined);
        };
    }, [id]);

    const state: ListSubheader.State = React.useMemo(() => ({
        index,
        orientation,
        nestedListNumber,
        nestedListItemNumber,
        type
    }), [
        index,
        nestedListItemNumber,
        nestedListNumber,
        orientation,
        type
    ]);

    const element = useRenderElement(tag, componentProps, {
        ref,
        state,
        props: [elementProps]
    });

    return element;
}

export namespace ListSubheader {
    export type ElementType = Extract<keyof React.JSX.IntrinsicElements, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>;

    export type State = {
        index: number;
        orientation: Orientation;
        nestedListNumber: number;
        nestedListItemNumber: number;
    };

    export type Props<Tag extends ElementType> = {
        /**
         * The tag of the subheader.
         * @default 'h3'
         */
        tag?: Tag;
    } & HeadlessUIComponentProps<Tag, State>;
}
