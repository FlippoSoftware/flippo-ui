import React from 'react';

import { useStore } from '@flippo-ui/hooks/use-store';

import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { CompositeList } from '../../Composite/list/CompositeList';
import { useComboboxRootContext } from '../root/ComboboxRootContext';
import { selectors } from '../store';

import { ComboboxChipsContext } from './ComboboxChipsContext';

import type { ComboboxChipsContextValue } from './ComboboxChipsContext';

/**
 * A container for the chips in a multiselectable input.
 * Renders a `<div>` element.
 */
export function ComboboxChips(componentProps: ComboboxChips.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const store = useComboboxRootContext();

    const open = useStore(store, selectors.open);

    const [highlightedChipIndex, setHighlightedChipIndex] = React.useState<number | undefined>(
        undefined
    );

    if (open && highlightedChipIndex !== undefined) {
        setHighlightedChipIndex(undefined);
    }

    const chipsRef = React.useRef<Array<HTMLButtonElement | null>>([]);

    const element = useRenderElement('div', componentProps, {
        ref: [ref, store.state.chipsContainerRef],
        props: elementProps
    });

    const contextValue: ComboboxChipsContextValue = React.useMemo(
        () => ({
            highlightedChipIndex,
            setHighlightedChipIndex,
            chipsRef
        }),
        [highlightedChipIndex, setHighlightedChipIndex, chipsRef]
    );

    return (
        <ComboboxChipsContext.Provider value={contextValue}>
            <CompositeList elementsRef={chipsRef}>{element}</CompositeList>
        </ComboboxChipsContext.Provider>
    );
}

export type ComboboxChipsState = {};

export type ComboboxChipsProps = {} & HeadlessUIComponentProps<'div', ComboboxChips.State>;

export namespace ComboboxChips {
    export type State = ComboboxChipsState;
    export type Props = ComboboxChipsProps;
}
