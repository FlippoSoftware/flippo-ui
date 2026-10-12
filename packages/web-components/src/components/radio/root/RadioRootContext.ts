import type { RadioGroupChangeEventDetails } from '@flippo-software/core-components/radio-group';

import { createContext } from '../../../lib/context';

import type { RadioGroupElement } from '../../radio-group/root/RadioGroupElement';

import type { RadioElement } from './RadioElement';

export type RadioGroupValueChangeDetail = {
    value: string;
    reason: RadioGroupChangeEventDetails['reason'];
};

export const RadioGroupContext = createContext<RadioGroupElement>('radio-group');

export const RadioContext = createContext<RadioElement>('radio');

export const RADIO = [RadioContext] as const;
