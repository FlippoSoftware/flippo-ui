'use client';
import { checkboxGroup as recipe } from '@flippo-software/component-styles/checkbox-group';
import { CheckboxGroup as Primitive } from '@flippo-ui/headless-components/checkbox-group';

import { createStyler } from '../../lib/Styled';

import type { StyledComponent } from '../../lib/Styled';
export const CheckboxGroup: StyledComponent<typeof Primitive, typeof recipe> = createStyler(recipe, 'checkboxGroup')(
    Primitive,
    undefined,
    true
);
