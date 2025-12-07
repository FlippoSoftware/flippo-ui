import React from 'react';

import { useEventCallback } from '@flippo-ui/hooks/use-event-callback';
import { useStore } from '@flippo-ui/hooks/use-store';

import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { stopEvent } from '~@packages/floating-ui-react/utils';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { CompositeList } from '../../Composite/list/CompositeList';
import { ComboboxCollection } from '../collection/ComboboxCollection';
import { useComboboxPositionerContext } from '../positioner/ComboboxPositionerContext';
import {
    useComboboxDerivedItemsContext,
    useComboboxFloatingContext,
    useComboboxRootContext
} from '../root/ComboboxRootContext';
import { selectors } from '../store';

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

    const store = useComboboxRootContext();
    const floatingRootContext = useComboboxFloatingContext();
    const hasPositionerContext = Boolean(useComboboxPositionerContext(true));
    const { filteredItems } = useComboboxDerivedItemsContext();

    const items = useStore(store, selectors.items);
    const labelsRef = useStore(store, selectors.labelsRef);
    const listRef = useStore(store, selectors.listRef);
    const selectionMode = useStore(store, selectors.selectionMode);
    const grid = useStore(store, selectors.grid);
    const popupProps = useStore(store, selectors.popupProps);
    const disabled = useStore(store, selectors.disabled);
    const readOnly = useStore(store, selectors.readOnly);
    const virtualized = useStore(store, selectors.virtualized);

    const multiple = selectionMode === 'multiple';
    const empty = filteredItems.length === 0;

    const setPositionerElement = useEventCallback((element) => {
        store.set('positionerElement', element);
    });

    const setListElement = useEventCallback((element) => {
        store.set('listElement', element);
    });

    // Support "closed template" API: if children is a function, implicitly wrap it
    // with a Combobox.Collection that reads items from context/root.
    // Ensures this component's `popupProps` subscription does not cause <Combobox.Item>
    // to re-render on every active index change.
    const resolvedChildren = React.useMemo(() => {
        if (typeof children === 'function') {
            return <ComboboxCollection>{children}</ComboboxCollection>;
        }
        return children;
    }, [children]);

    const state: ComboboxList.State = React.useMemo(
        () => ({
            empty
        }),
        [empty]
    );

    const floatingId = floatingRootContext.useState('floatingId');

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, setListElement, hasPositionerContext ? null : setPositionerElement],
        props: [popupProps, {
            'children': resolvedChildren,
            'tabIndex': -1,
            'id': floatingId,
            'role': grid ? 'grid' : 'listbox',
            'aria-multiselectable': multiple ? 'true' : undefined,
            onKeyDown(event) {
                if (disabled || readOnly) {
                    return;
                }

                if (event.key === 'Enter') {
                    const activeIndex = store.state.activeIndex;

                    if (activeIndex == null) {
                        // Allow form submission when no item is highlighted.
                        return;
                    }

                    stopEvent(event);

                    const nativeEvent = event.nativeEvent;
                    const listItem = store.state.listRef.current[activeIndex];

                    if (listItem) {
                        store.state.selectionEventRef.current = nativeEvent;
                        listItem.click();
                        store.state.selectionEventRef.current = null;
                    }
                }
            },
            onKeyDownCapture() {
                store.state.keyboardActiveRef.current = true;
            },
            onPointerMoveCapture() {
                store.state.keyboardActiveRef.current = false;
            }
        }, elementProps]
    });

    if (virtualized) {
        return element;
    }

    return (
        <CompositeList elementsRef={listRef} labelsRef={items ? undefined : labelsRef}>
            {element}
        </CompositeList>
    );
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
