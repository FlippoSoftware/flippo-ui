'use client';
import { container as recipe } from '@flippo-software/component-styles/container';

import { presentation } from '~@lib/Presentation';

import type { Presentation } from '~@lib/Presentation';
export const Container: Presentation<'div', typeof recipe, 'container'> = presentation('div', recipe, undefined, 'container', 'container');
