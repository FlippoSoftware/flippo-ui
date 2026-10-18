import type { TransitionStatus } from '~@lib/types';

import type { CustomStyleHookMapping } from './getStyleHookProps';

export enum TransitionStatusDataAttributes {
    /**
     * Present when the element is animating in.
     */
    startingStyle = 'data-starting-style',
    /**
     * Present when the element is animating out.
     */
    endingStyle = 'data-ending-style'
}

const STARTING_HOOK = { [TransitionStatusDataAttributes.startingStyle]: '' };
const ENDING_HOOK = { [TransitionStatusDataAttributes.endingStyle]: '' };

export const transitionStatusMapping = {
    transitionStatus(value): Record<string, string> | null {
        if (value === 'starting') {
            return STARTING_HOOK;
        }
        if (value === 'ending') {
            return ENDING_HOOK;
        }
        return null;
    }
} satisfies CustomStyleHookMapping<{ transitionStatus: TransitionStatus }>;
