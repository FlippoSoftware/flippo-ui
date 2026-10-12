'use client';
import { blockquote as recipe } from '@flippo-software/component-styles/blockquote';

import { presentation } from '../../lib/Presentation';

import type { Presentation } from '../../lib/Presentation';
export const Blockquote: Presentation<'blockquote', typeof recipe, 'blockquote'> = presentation(
    'blockquote',
    recipe,
    undefined,
    'blockquote',
    'blockquote'
);
