import { SwitchRootDataAttributes } from '@flippo-software/core-components/switch';

import type { CustomStyleHookMapping } from '~@lib/getStyleHookProps';

import { fieldValidityMapping } from '../Field/utils/constants';

import type { SwitchRoot } from './root/SwitchRoot';

export const styleHookMapping: CustomStyleHookMapping<SwitchRoot.State> = {
    ...fieldValidityMapping,
    checked(value): Record<string, string> {
        if (value) {
            return {
                [SwitchRootDataAttributes.checked]: ''
            };
        }

        return {
            [SwitchRootDataAttributes.unchecked]: ''
        };
    }
};
