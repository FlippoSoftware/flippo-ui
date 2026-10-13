'use client';
import { section as recipe } from '@flippo-software/component-styles/section';

import { presentation } from '~@lib/Presentation';

import type { Presentation } from '~@lib/Presentation';
export const Section: Presentation<'section', typeof recipe, 'section'> = presentation('section', recipe, undefined, 'section', 'section');
