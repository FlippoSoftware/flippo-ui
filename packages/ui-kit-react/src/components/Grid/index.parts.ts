'use client';
import { grid as recipe } from '@flippo-software/component-styles/grid';

import { presentation } from '~@lib/Presentation';

import type { Presentation } from '~@lib/Presentation';
export const Root: Presentation<'div', typeof recipe, 'grid'> = presentation('div', recipe, 'root', 'grid', 'grid');
export const Item: Presentation<'div', typeof recipe, 'box'> = presentation('div', recipe, 'item', 'box', 'grid');
