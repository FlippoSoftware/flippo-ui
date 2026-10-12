import { createContext } from '../../../lib/context';

import type { FieldsetElement } from './FieldsetElement';

export const FieldsetContext = createContext<FieldsetElement>('fieldset');

export const FIELDSET = [FieldsetContext] as const;
