import { MenuCheckboxItemDataAttributes } from '@flippo-software/core-components/menu';

import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';

export const itemMapping: StateAttributesMapping<{ checked: boolean }> = {
    checked(value): Record<string, string> {
        if (value) {
            return {
                [MenuCheckboxItemDataAttributes.checked]: ''
            };
        }
        return {
            [MenuCheckboxItemDataAttributes.unchecked]: ''
        };
    },
    ...transitionStatusMapping
};
