import type { TransitionStatus } from '@flippo-ui/hooks';

import { transitionStatusMapping } from '@lib/styleHookMapping';

import type { StateAttributesMapping } from '@lib/getStyleHookProps';

import { fieldValidityMapping } from '../../Field/utils/constants';
import { PinInputDataAttributes } from '../root/PinInputDataAttributes';

export const pinInputStyleHookMapping = {
    completed(value): Record<string, string> {
        if (value) {
            return { [PinInputDataAttributes.completed]: '' };
        }
        return { [PinInputDataAttributes.completed]: '' };
    },
    ...transitionStatusMapping,
    ...fieldValidityMapping
} satisfies StateAttributesMapping<{
    completed: boolean;
    transitionStatus: TransitionStatus;
    valid: boolean | null;
}>;
