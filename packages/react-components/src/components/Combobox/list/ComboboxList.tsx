import React from 'react';

import { ComboboxListMachine } from '@flippo-software/core-components/combobox';
import { useIsoLayoutEffect } from '@flippo-software/react-hooks';

import { toReactProps, useMachineState, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { ComboboxCollection } from '../collection/ComboboxCollection';
import { useComboboxPositionerContext } from '../positioner/ComboboxPositionerContext';
import { useComboboxRootMachine } from '../root/ComboboxRootContext';

import { ComboboxListContext } from './ComboboxListContext';

/**
 * A list container for the items.
 * Renders a `<div>` element.
 */
export function ComboboxList(componentProps: ComboboxList.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        children,
        ref,
        ...elementProps
    } = componentProps;

    const root = useComboboxRootMachine();
    const hasPositioner = Boolean(useComboboxPositionerContext(true));

    const [list] = React.useState(() => new ComboboxListMachine(root, hasPositioner));
    useIsoLayoutEffect(() => list.connect(), [list]);

    const track = useTracker();
    const state: ComboboxList.State = useMachineState(list);

    // Support the "closed template" API: a function child is wrapped in a `Combobox.Collection` that reads the
    // filtered items (so this component's subscriptions don't re-render the items).
    const resolvedChildren = React.useMemo(() => {
        if (typeof children === 'function') {
            return <ComboboxCollection>{children}</ComboboxCollection>;
        }
        return children;
    }, [children]);

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, list.setElement],
        props: [elementProps, (props) => track(() => toReactProps(list.getListProps({ ...props, children: resolvedChildren })))]
    });

    // Virtualized items pass their index explicitly and don't register.
    if (track(() => root.store.state.virtualized)) {
        return element;
    }

    return <ComboboxListContext value={list}>{element}</ComboboxListContext>;
}

export type ComboboxListState = {
    /**
     * Whether the list is empty.
     */
    empty: boolean;
};

export type ComboboxListProps = {
    children?: React.ReactNode | ((item: any, index: number) => React.ReactNode);
} & Omit<HeadlessUIComponentProps<'div', ComboboxList.State>, 'children'>;

export namespace ComboboxList {
    export type State = ComboboxListState;
    export type Props = ComboboxListProps;
}
