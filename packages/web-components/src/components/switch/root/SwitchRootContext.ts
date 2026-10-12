import type { SwitchChangeEventDetails } from '@flippo-software/core-components/switch';

import { createContext } from '../../../lib/context';

import type { SwitchElement } from './SwitchElement';

export type SwitchCheckedChangeDetail = {
    checked: boolean;
    reason: SwitchChangeEventDetails['reason'];
};

export const SwitchContext = createContext<SwitchElement>('switch');

export const SWITCH = [SwitchContext] as const;
