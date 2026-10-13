'use client';
import { kbd as recipe } from '@flippo-software/component-styles/kbd';

import { presentation } from '~@lib/Presentation';

import type { Presentation } from '~@lib/Presentation';
export const Kbd: Presentation<'kbd', typeof recipe, 'kbd'> = presentation('kbd', recipe, undefined, 'kbd', 'kbd');
