import type { TransitionStatus } from '@flippo_ui/hooks';

import { transitionStatusMapping } from '@lib/styleHookMapping';

import type { CustomStyleHookMapping } from '@lib/getStyleHookProps';

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
} satisfies CustomStyleHookMapping<{
    checked: boolean;
    transitionStatus: TransitionStatus;
    valid: boolean | null;
}>;
