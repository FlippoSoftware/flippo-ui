import { createContext } from '../../../lib/context';

import type { RadioCardElement } from './RadioCardElement';

export const RadioCardContext = createContext<RadioCardElement>('radio-card');

export const RADIO_CARD = [RadioCardContext] as const;
