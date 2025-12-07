import type { TransitionStatus } from '@flippo-ui/hooks/use-transition-status';

import { DISABLED_TRANSITIONS_STYLE, EMPTY_OBJECT } from './constants';

export function getDisabledMountTransitionStyles(transitionStatus: TransitionStatus): {
    style?: React.CSSProperties;
} {
    return transitionStatus === 'starting' ? DISABLED_TRANSITIONS_STYLE : EMPTY_OBJECT;
}
