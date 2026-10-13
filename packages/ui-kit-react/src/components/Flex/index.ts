'use client';
import { flex as recipe } from '@flippo-software/component-styles/flex';

import { presentation } from '~@lib/Presentation';

import type { Presentation } from '~@lib/Presentation';
export const Flex: Presentation<'div', typeof recipe, 'flex'> = presentation('div', recipe, undefined, 'flex', 'flex');
