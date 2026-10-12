'use client';
import { checkboxCard as recipe } from '@flippo-software/component-styles/checkbox-card';
import { CheckboxCard as Primitive } from '@flippo-ui/headless-components/checkbox-card';

import { CHECK_ICONS } from '../../lib/Icon';
import { createStyler } from '../../lib/Styled';

import type { RecipeVariants, StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'checkboxCard');
export type Variants = RecipeVariants<typeof recipe>;
export const Indicator: StyledComponent<typeof Primitive.Indicator, typeof recipe> = styled(Primitive.Indicator, 'indicator', false, {
    defaults: { keepMounted: true, children: CHECK_ICONS }
});
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
