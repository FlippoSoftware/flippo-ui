'use client';
import { switchRecipe as recipe } from '@flippo-software/component-styles/switch';
import { Switch as Primitive } from '@flippo-software/react-components/switch';

import { createStyler } from '~@lib/Styled';

import type { RecipeVariants, StyledComponent } from '~@lib/Styled';

const styled = createStyler(recipe, 'switch');
export type Variants = RecipeVariants<typeof recipe>;
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
export const Thumb: StyledComponent<typeof Primitive.Thumb, typeof recipe> = styled(Primitive.Thumb, 'thumb', false);
export const Label: StyledComponent<'label', typeof recipe> = styled('label', 'label');
