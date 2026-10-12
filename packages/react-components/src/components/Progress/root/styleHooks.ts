import type { CustomStyleHookMapping } from '~@lib/getStyleHookProps';

import { ProgressRootDataAttributes } from './ProgressRootDataAttributes';

import type { ProgressRoot } from './ProgressRoot';

export const progressStyleHookMapping: CustomStyleHookMapping<ProgressRoot.State> = {
    status(value: ProgressRoot.Status): Record<string, string> | null {
        if (value === 'progressing') {
            return { [ProgressRootDataAttributes.progressing]: '' };
        }
        if (value === 'complete') {
            return { [ProgressRootDataAttributes.complete]: '' };
        }
        if (value === 'indeterminate') {
            return { [ProgressRootDataAttributes.indeterminate]: '' };
        }

        return null;
    }
};
