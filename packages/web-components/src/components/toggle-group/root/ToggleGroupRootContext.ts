import type { ToggleGroupChangeEventDetails } from '@flippo-software/core-components/toggle-group';

import { createContext } from '../../../lib/context';

import type { ToggleGroupElement } from './ToggleGroupElement';

export type ToggleGroupValueChangeDetail = {
    value: string[];
    reason: ToggleGroupChangeEventDetails['reason'];
};

export const ToggleGroupContext = createContext<ToggleGroupElement>('toggle-group');
