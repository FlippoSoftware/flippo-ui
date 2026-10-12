'use client';
import { box as recipe } from '@flippo-software/component-styles/box';

import { presentation } from '../../lib/Presentation';

import type { Presentation } from '../../lib/Presentation';
export const Box: Presentation<'div', typeof recipe, 'box'> = presentation('div', recipe, undefined, 'box', 'box');
