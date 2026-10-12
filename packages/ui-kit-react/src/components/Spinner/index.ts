'use client';
import { spinner as recipe } from '@flippo-software/component-styles/spinner';

import { presentation } from '../../lib/Presentation';

import type { Presentation } from '../../lib/Presentation';
export const Spinner: Presentation<'span', typeof recipe, 'spinner'> = presentation('span', recipe, undefined, 'spinner', 'spinner');
