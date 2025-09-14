'use client';

import React from 'react';

import { useMergedRef } from '@flippo-ui/hooks';

import type { HTMLProps } from '@lib/types';

import { useCompositeListItem } from '../list/useCompositeListItem';
import { useCompositeRootContext } from '../root/CompositeRootContext';

export type UseCompositeItemParams<Metadata> = {
    metadata?: Metadata;
};

export function useCompositeItem<Metadata>(params: UseCompositeItemParams<Metadata> = {}) {
    const { highlightItemOnHover, highlightedIndex, onHighlightedIndexChange } = useCompositeRootContext();
    const { ref, index } = useCompositeListItem(params);

    const isHighlighted = highlightedIndex === index;

    const itemRef = React.useRef<HTMLElement | null>(null);
    const mergedRef = useMergedRef(ref, itemRef);

    const compositeProps = React.useMemo<HTMLProps>(() => ({
        tabIndex: isHighlighted ? 0 : -1,
        onFocus() {
            onHighlightedIndexChange(index);
        },
        onMouseMove() {
            const item = itemRef.current;
            if (!highlightItemOnHover || !item) {
                return;
            }

            const disabled = item.hasAttribute('disabled') || item.ariaDisabled === 'true';
            if (!isHighlighted && !disabled) {
                item.focus();
            }
        }
    }), [
        highlightItemOnHover,
        index,
        isHighlighted,
        onHighlightedIndexChange
    ]);

    return {
        compositeProps,
        compositeRef: mergedRef as React.RefCallback<HTMLElement | null>,
        index,
        isHighlighted
    };
}
