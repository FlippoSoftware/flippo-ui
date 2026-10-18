import React from 'react';

import { CheckboxRootDataAttributes } from '@flippo-software/core-components/checkbox';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';

import type { CheckboxRoot } from '../root/CheckboxRoot';

export function useStateAttributesMapping(state: CheckboxRoot.State) {
    return React.useMemo<StateAttributesMapping<typeof state>>(
        () => ({
            checked(value): Record<string, string> {
                if (state.indeterminate) {
                    // `data-indeterminate` is already handled by the `indeterminate` prop.
                    return {};
                }

                if (value) {
                    return {
                        [CheckboxRootDataAttributes.checked]: ''
                    };
                }

                return {
                    [CheckboxRootDataAttributes.unchecked]: ''
                };
            }
        }),
        [state.indeterminate]
    );
}
