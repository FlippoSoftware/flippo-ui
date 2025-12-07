import type { StateAttributesMapping } from '~@lib/getStyleHookProps';

import { ScrollAreaRootDataAttributes } from './ScrollAreaRootDataAttributes';

import type { ScrollAreaRoot } from './ScrollAreaRoot';

export const scrollAreaStateAttributesMapping: StateAttributesMapping<ScrollAreaRoot.State> = {
    hasOverflowX: (value) => (value ? { [ScrollAreaRootDataAttributes.hasOverflowX]: '' } : null),
    hasOverflowY: (value) => (value ? { [ScrollAreaRootDataAttributes.hasOverflowY]: '' } : null),
    overflowXStart: (value) => (value ? { [ScrollAreaRootDataAttributes.overflowXStart]: '' } : null),
    overflowXEnd: (value) => (value ? { [ScrollAreaRootDataAttributes.overflowXEnd]: '' } : null),
    overflowYStart: (value) => (value ? { [ScrollAreaRootDataAttributes.overflowYStart]: '' } : null),
    overflowYEnd: (value) => (value ? { [ScrollAreaRootDataAttributes.overflowYEnd]: '' } : null),
    cornerHidden: () => null
};
