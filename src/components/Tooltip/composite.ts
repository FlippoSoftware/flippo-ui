import { createCompositeList, createUseCompositeListItem } from '../Composite';
import { createCompositeListContext } from '../Composite/list/CompositeListContext';

import type { CompositeMetadata } from '../Composite';
import type { CompositeListContextValue } from '../Composite/list/CompositeListContext';

export type CompositeTooltipMetadata = CompositeMetadata<{}>;

export type CompositeTooltipListContextValue = CompositeListContextValue<CompositeTooltipMetadata>;

export const { CompositeListContext: CompositeTooltipListContext, useCompositeListContext: useCompositeTooltipListContext }
= createCompositeListContext<CompositeTooltipMetadata>();

export const CompositeTooltipList = createCompositeList({
    CompositeListContext: CompositeTooltipListContext
});

export const useCompositeTooltipListItem = createUseCompositeListItem({
    useCompositeListContext: useCompositeTooltipListContext
});
