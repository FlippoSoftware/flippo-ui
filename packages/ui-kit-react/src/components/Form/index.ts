'use client';
import { form as recipe } from '@flippo-software/component-styles/form';
import { Form as Primitive } from '@flippo-software/react-components/form';

import { createStyler } from '~@lib/Styled';

import type { StyledComponent } from '~@lib/Styled';
export const Form: StyledComponent<typeof Primitive, typeof recipe> = createStyler(recipe, 'form')(Primitive, undefined, true);
