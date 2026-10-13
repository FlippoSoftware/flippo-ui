'use client';
import { skeleton as recipe } from '@flippo-software/component-styles/skeleton';

import { presentation } from '~@lib/Presentation';

import type { Presentation } from '~@lib/Presentation';
export const Skeleton: Presentation<'span', typeof recipe, 'skeleton'> = presentation('span', recipe, undefined, 'skeleton', 'skeleton');
