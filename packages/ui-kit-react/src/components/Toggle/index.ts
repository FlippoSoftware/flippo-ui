'use client';
import { toggle as recipe } from '@flippo-software/component-styles/toggle';
import { Toggle as Primitive } from '@flippo-ui/headless-components/toggle';

import { createStyler } from '../../lib/Styled';

import type { StyledComponent } from '../../lib/Styled';
export const Toggle: StyledComponent<typeof Primitive, typeof recipe> = createStyler(recipe, 'toggle')(Primitive, undefined, true);
