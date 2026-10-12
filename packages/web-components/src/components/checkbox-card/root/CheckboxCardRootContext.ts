import type { CheckboxCardChangeEventDetails } from '@flippo-software/core-components/checkbox-card';

import { createContext } from '../../../lib/context';

import type { CheckboxCardElement } from './CheckboxCardElement';

export type CheckboxCardCheckedChangeDetail = {
    checked: boolean;
    reason: CheckboxCardChangeEventDetails['reason'];
};

export const CheckboxCardContext = createContext<CheckboxCardElement>('checkbox-card');

export const CHECKBOX_CARD_CARD = [CheckboxCardContext] as const;
