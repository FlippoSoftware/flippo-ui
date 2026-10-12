'use client';
import { separator as recipe } from '@flippo-software/component-styles/separator';
import { Separator as Primitive } from '@flippo-software/react-components/separator';

import { createStyler } from '../../lib/Styled';

import type { StyledComponent } from '../../lib/Styled';
export const Separator: StyledComponent<typeof Primitive, typeof recipe> = createStyler(recipe, 'separator')(Primitive, undefined, true);
