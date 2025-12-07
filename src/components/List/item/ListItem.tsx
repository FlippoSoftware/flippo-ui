import React from 'react';

import { useRenderElement } from '~@lib/hooks';

import type {
    HeadlessUIComponentProps,
    HTMLProps,
    NonNativeButtonProps,
    Orientation
} from '~@lib/types';

import { useCompositeListItem } from '../../Composite';
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

    const { ref, index } = useCompositeListItem();
    const { getButtonProps, buttonRef } = useButton({ disabled, focusableWhenDisabled, native: nativeButton });

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
        ref: [ref, refProp, buttonRef],
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
    } & NonNativeButtonProps & HeadlessUIComponentProps<'li', State>;
}
