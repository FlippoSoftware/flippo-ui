import type { TransitionStatus } from '@flippo-ui/hooks';

import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';

import { fieldValidityMapping } from '../../Field/utils/constants';

export const pinInputStyleHookMapping = {
    ...transitionStatusMapping,
    ...fieldValidityMapping
} satisfies StateAttributesMapping<{
    transitionStatus: TransitionStatus;
    valid: boolean | null;
}>;
