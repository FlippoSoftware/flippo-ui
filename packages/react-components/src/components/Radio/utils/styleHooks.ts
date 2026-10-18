import { RadioRootDataAttributes } from '@flippo-software/core-components/radio';

import type { TransitionStatus } from '@flippo-software/react-hooks';

import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';

import { fieldValidityMapping } from '../../Field/utils/constants';

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
