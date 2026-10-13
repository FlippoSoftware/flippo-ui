'use client';
import { toggleGroup as recipe } from '@flippo-software/component-styles/toggle-group';
import { ToggleGroup as Primitive } from '@flippo-software/react-components/toggle-group';

import { createStyler } from '~@lib/Styled';

import type { StyledComponent } from '~@lib/Styled';
export const ToggleGroup: StyledComponent<typeof Primitive, typeof recipe> = createStyler(recipe, 'toggleGroup')(
    Primitive,
    undefined,
    true
);
