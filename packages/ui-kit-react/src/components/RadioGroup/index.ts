'use client';
import { radioGroup as recipe } from '@flippo-software/component-styles/radio-group';
import { RadioGroup as Primitive } from '@flippo-software/react-components/radio-group';

import { createStyler } from '../../lib/Styled';

import type { StyledComponent } from '../../lib/Styled';
export const RadioGroup: StyledComponent<typeof Primitive, typeof recipe> = createStyler(recipe, 'radioGroup')(Primitive, undefined, true);
