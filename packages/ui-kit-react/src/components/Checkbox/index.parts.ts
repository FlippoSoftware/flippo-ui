'use client';
import { checkbox as recipe } from '@flippo-software/component-styles/checkbox';
import { Checkbox as Primitive } from '@flippo-ui/headless-components/checkbox';

import { CHECK_ICONS } from '../../lib/Icon';
import { createStyler } from '../../lib/Styled';

import type { RecipeVariants, StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'checkbox');
export type Variants = RecipeVariants<typeof recipe>;
export const Indicator: StyledComponent<typeof Primitive.Indicator, typeof recipe> = styled(Primitive.Indicator, 'indicator', false, {
    defaults: { children: CHECK_ICONS }
});
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
export const Label: StyledComponent<'label', typeof recipe> = styled('label', 'label');
