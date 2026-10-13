'use client';
import { text as recipe } from '@flippo-software/component-styles/text';

import { presentation } from '~@lib/Presentation';

import type { Presentation } from '~@lib/Presentation';
export const Text: Presentation<'span', typeof recipe, 'text'> = presentation('span', recipe, undefined, 'text', 'text');
