'use client';
import { strong as recipe } from '@flippo-software/component-styles/strong';

import { presentation } from '../../lib/Presentation';

import type { Presentation } from '../../lib/Presentation';
export const Strong: Presentation<'strong', typeof recipe, 'strong'> = presentation('strong', recipe, undefined, 'strong', 'strong');
