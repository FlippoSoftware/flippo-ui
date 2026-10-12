'use client';
import { em as recipe } from '@flippo-software/component-styles/em';

import { presentation } from '../../lib/Presentation';

import type { Presentation } from '../../lib/Presentation';
export const Em: Presentation<'em', typeof recipe, 'em'> = presentation('em', recipe, undefined, 'em', 'em');
