import React from 'react';

import { useIsoLayoutEffect } from '@flippo-ui/hooks/use-iso-layout-effect';

import { useRenderElement } from '~@lib/hooks';

import type {
    HeadlessUIComponentProps,
    HTMLProps,
    NonNativeButtonProps,
    Orientation
} from '~@lib/types';

import {
    IndexGuessBehavior,
    useCompositeListItem
} from '../../Composite/list/useCompositeListItem';
import { useButton } from '../../use-button';
import { useListRootContext } from '../root/ListRootContext';
import { NestedListContext, useNestedListContext } from '../root/NestedListContext';

import type { ListRoot } from '../root/ListRoot';
import type { NestedListContextValue } from '../root/NestedListContext';

import { ListItemContext } from './ListItemContext';

import type { ListItemContextValue } from './ListItemContext';

/**
 * Individual item in the list with selection and interaction support.
 * Renders a `<div>` element by default.
 */
export function ListItem(componentProps: ListItem.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref: refProp,
        index: indexProp,
        interactive = false,
        disabled = false,
        focusableWhenDisabled = false,
        nativeButton = false,
        selected = false,
        ...elementProps
    } = componentProps;

    const [subheaderId, setSubheaderId] = React.useState<string | undefined>(undefined);
    const nested = useNestedListContext() !== undefined;

    const { store } = useListRootContext();

    const orientation = store.useState('orientation');
    const type = store.useState('type');
    const virtualized = store.useState('virtualized');
    const elementsRef = store.useState('elementsRef');

    const listItem = useCompositeListItem({
        index: indexProp,
        indexGuessBehavior: IndexGuessBehavior.GuessFromOrder
    });

    const itemRef = React.useRef<HTMLElement | null>(null);

    const index = indexProp ?? listItem.index;
    const hasRegistered = listItem.index !== -1;

    const { getButtonProps, buttonRef } = useButton({ disabled, focusableWhenDisabled, native: nativeButton });

    // Register element in elementsRef when virtualized
    useIsoLayoutEffect(() => {
        const shouldRun = hasRegistered && (virtualized || indexProp != null);
        if (!shouldRun) {
            return undefined;
        }

        const list = elementsRef.current;
        list[index] = itemRef.current;

        return () => {
            delete list[index];
        };
    }, [
        hasRegistered,
        virtualized,
        index,
        indexProp,
        elementsRef
    ]);

    const state: ListItem.State = React.useMemo(() => ({
        index,
        orientation,
        interactive,
        disabled,
        selected,
        nested,
        type
    }), [
        index,
        orientation,
        interactive,
        disabled,
        selected,
        nested,
        type
    ]);

    const listItemProps = React.useMemo<HTMLProps>(() => ({
        'aria-selected': selected && interactive && !disabled
    }), [disabled, interactive, selected]);

    const context = React.useMemo<ListItemContextValue>(() => ({
        index,
        setSubheaderId
    }), [index]);

    const nestedContext = React.useMemo<NestedListContextValue>(() =>
        ({ subheaderId, nestedListItemNumber: index + 1 }), [subheaderId, index]);

    const element = useRenderElement('li', componentProps, {
        state,
        ref: [listItem.ref, refProp, buttonRef, itemRef],
        props: [listItemProps, interactive ? getButtonProps(elementProps) : elementProps]
    });

    return (
        <ListItemContext value={context}>
            <NestedListContext value={nestedContext}>
                {element}
            </NestedListContext>
        </ListItemContext>
    );
}

export namespace ListItem {
    export type State = {

        /**
         * Index of this item in the filtered list.
         */
        index: number;

        /**
         * Layout orientation.
         */
        orientation: Orientation;

        /**
         * Whether the item is interactive.
         */
        interactive: boolean;

        /**
         * Whether the item is disabled.
         */
        disabled: boolean;

        /**
         * Whether the item is nested.
         */
        nested: boolean;

        /**
         * Whether the item is selected.
         */
        selected: boolean;

        /**
         * The type of the list.
         */
        type: ListRoot.State['type'];
    };

    export type Props = {
        /**
         * Whether the item is selected.
         */
        selected?: boolean;

        /**
         * Whether the item is interactive.
         */
        interactive?: boolean;

        /**
         * Whether the item is disabled.
         */
        disabled?: boolean;
        /**
         * Whether the item is focusable when disabled.
         */
        focusableWhenDisabled?: boolean;
        /**
         * The index of the item in the list. Required when `virtualized` is `true`
         * on the parent `List.Root`. Improves performance when specified by avoiding
         * the need to calculate the index automatically from the DOM.
         */
        index?: number;
    } & NonNativeButtonProps & HeadlessUIComponentProps<'li', State>;
}
