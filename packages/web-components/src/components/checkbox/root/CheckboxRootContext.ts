import type { CheckboxChangeEventDetails } from '@flippo-software/core-components/checkbox';
import type { CheckboxGroupChangeEventDetails } from '@flippo-software/core-components/checkbox-group';

import { createContext } from '../../../lib/context';

import type { CheckboxGroupElement } from '../../checkbox-group/root/CheckboxGroupElement';

import type { CheckboxElement } from './CheckboxElement';

export type CheckboxCheckedChangeDetail = {
    checked: boolean;
    reason: CheckboxChangeEventDetails['reason'];
};

export type CheckboxGroupValueChangeDetail = {
    value: string[];
    reason: CheckboxGroupChangeEventDetails['reason'];
};

export const CheckboxContext = createContext<CheckboxElement>('checkbox');

export const CheckboxGroupContext = createContext<CheckboxGroupElement>('checkbox-group');

export const CHECKBOX = [CheckboxContext] as const;
