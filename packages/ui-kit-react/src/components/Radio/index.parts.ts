'use client';
import { radio as recipe } from '@flippo-software/component-styles/radio';
import { Radio as Primitive } from '@flippo-ui/headless-components/radio';

import { createStyler } from '../../lib/Styled';

import type { RecipeVariants, StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'radio');
export type Variants = RecipeVariants<typeof recipe>;
export const Indicator: StyledComponent<typeof Primitive.Indicator, typeof recipe> = styled(Primitive.Indicator, 'indicator', false);
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
export const Label: StyledComponent<'label', typeof recipe> = styled('label', 'label');
