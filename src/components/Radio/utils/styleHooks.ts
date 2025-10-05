import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { TransitionStatus } from '@flippo-ui/hooks';
import type { StateAttributesMapping } from '~@lib/getStyleHookProps';

import { fieldValidityMapping } from '../../Field/utils/constants';
import { RadioRootDataAttributes } from '../root/RadioRootDataAttributes';

export const radioStyleHookMapping = {
    checked(value): Record<string, string> {
        if (value) {
            return { [RadioRootDataAttributes.checked]: '' };
        }
        return { [RadioRootDataAttributes.unchecked]: '' };
    },
    ...transitionStatusMapping,
    ...fieldValidityMapping
} satisfies StateAttributesMapping<{
    checked: boolean;
    transitionStatus: TransitionStatus;
    valid: boolean | null;
}>;
