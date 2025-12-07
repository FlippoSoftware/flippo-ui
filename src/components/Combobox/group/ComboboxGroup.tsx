import React from 'react';

import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { GroupCollectionProvider } from '../collection/GroupCollectionContext';

import { ComboboxGroupContext } from './ComboboxGroupContext';

/**
 * Groups related items with the corresponding label.
 * Renders a `<div>` element.
 */
export function ComboboxGroup(componentProps: ComboboxGroup.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        items,
        ref,
        ...elementProps
    } = componentProps;

    const [labelId, setLabelId] = React.useState<string | undefined>();

    const contextValue = React.useMemo(
        () => ({
            labelId,
            setLabelId,
            items
        }),
        [labelId, setLabelId, items]
    );

    const element = useRenderElement('div', componentProps, {
        ref,
        props: [{
            'role': 'group',
            'aria-labelledby': labelId
        }, elementProps]
    });

    const wrappedElement = (
        <ComboboxGroupContext.Provider value={contextValue}>{element}</ComboboxGroupContext.Provider>
    );

    if (items) {
        return <GroupCollectionProvider items={items}>{wrappedElement}</GroupCollectionProvider>;
    }

    return wrappedElement;
}

export type ComboboxGroupState = {};

export type ComboboxGroupProps = {
    /**
     * Items to be rendered within this group.
     * When provided, child `Collection` components will use these items.
     */
    items?: readonly any[];
} & HeadlessUIComponentProps<'div', ComboboxGroup.State>;

export namespace ComboboxGroup {
    export type State = ComboboxGroupState;
    export type Props = ComboboxGroupProps;
}
