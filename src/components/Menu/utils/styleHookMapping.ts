import { transitionStatusMapping } from '@lib/styleHookMapping';

import type { CustomStyleHookMapping } from '@lib/getStyleHookProps';

import { MenuCheckboxItemDataAttributes } from '../checkbox-item/MenuCheckboxItemDataAttributes';

export const itemMapping: CustomStyleHookMapping<{ checked: boolean }> = {
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
