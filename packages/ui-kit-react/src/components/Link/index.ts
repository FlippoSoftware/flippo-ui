'use client';
import { link as recipe } from '@flippo-software/component-styles/link';

import { presentation } from '~@lib/Presentation';

import type { Presentation } from '~@lib/Presentation';
export const Link: Presentation<'a', typeof recipe, 'link'> = presentation('a', recipe, undefined, 'link', 'link');
