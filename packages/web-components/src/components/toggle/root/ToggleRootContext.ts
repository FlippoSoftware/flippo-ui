import type { ToggleChangeEventDetails } from '@flippo-software/core-components/toggle';

export type TogglePressedChangeDetail = {
    pressed: boolean;
    reason: ToggleChangeEventDetails['reason'];
};
