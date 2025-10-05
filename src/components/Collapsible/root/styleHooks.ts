import { collapsibleOpenStateMapping as commonCollapsibleMapping } from '~@lib/collapsibleOpenStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { CustomStyleHookMapping } from '~@lib/getStyleHookProps';

import type { CollapsibleRoot } from './CollapsibleRoot';

export const collapsibleStyleHookMapping: CustomStyleHookMapping<CollapsibleRoot.State> = {
    ...commonCollapsibleMapping,
    ...transitionStatusMapping
};
