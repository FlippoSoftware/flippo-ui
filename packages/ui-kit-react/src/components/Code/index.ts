'use client';
import { code as recipe } from '@flippo-software/component-styles/code';

import { presentation } from '../../lib/Presentation';

import type { Presentation } from '../../lib/Presentation';
export const Code: Presentation<'code', typeof recipe, 'code'> = presentation('code', recipe, undefined, 'code', 'code');
