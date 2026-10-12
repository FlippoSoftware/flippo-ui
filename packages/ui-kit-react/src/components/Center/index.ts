'use client';
import { center as recipe } from '@flippo-software/component-styles/center';

import { presentation } from '../../lib/Presentation';

import type { Presentation } from '../../lib/Presentation';
export const Center: Presentation<'div', typeof recipe, 'center'> = presentation('div', recipe, undefined, 'center', 'center');
