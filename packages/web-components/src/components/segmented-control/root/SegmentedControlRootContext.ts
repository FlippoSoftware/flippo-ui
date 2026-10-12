import type { SegmentedControlChangeEventDetails } from '@flippo-software/core-components/segmented-control';

import { createContext } from '../../../lib/context';

import type { SegmentedControlElement } from './SegmentedControlElement';

export type SegmentedControlValueChangeDetail = {
    value: string;
    reason: SegmentedControlChangeEventDetails['reason'];
};

export const SegmentedControlContext = createContext<SegmentedControlElement>('segmented-control');

export const SEGMENTED_CONTROL_CONTROL = [SegmentedControlContext] as const;
