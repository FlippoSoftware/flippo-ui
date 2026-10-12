'use client';
import { quote as recipe } from '@flippo-software/component-styles/quote';

import { presentation } from '../../lib/Presentation';

import type { Presentation } from '../../lib/Presentation';
export const Quote: Presentation<'q', typeof recipe, 'quote'> = presentation('q', recipe, undefined, 'quote', 'quote');
