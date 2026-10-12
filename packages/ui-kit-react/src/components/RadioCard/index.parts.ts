'use client';
import { radioCard as recipe } from '@flippo-software/component-styles/radio-card';
import { RadioCard as Primitive } from '@flippo-software/react-components/radio-card';

import { createStyler } from '../../lib/Styled';

import type { RecipeVariants, StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'radioCard');
export type Variants = RecipeVariants<typeof recipe>;
export const Indicator: StyledComponent<typeof Primitive.Indicator, typeof recipe> = styled(Primitive.Indicator, 'indicator', false, {
    defaults: { keepMounted: true }
});
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
