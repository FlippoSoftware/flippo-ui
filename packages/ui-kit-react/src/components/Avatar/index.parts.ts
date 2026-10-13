'use client';
import { avatar as recipe } from '@flippo-software/component-styles/avatar';
import { Avatar as Primitive } from '@flippo-software/react-components/avatar';

import { createStyler } from '~@lib/Styled';

import type { RecipeVariants, StyledComponent } from '~@lib/Styled';

const styled = createStyler(recipe, 'avatar');
export type Variants = RecipeVariants<typeof recipe>;
export const Fallback: StyledComponent<typeof Primitive.Fallback, typeof recipe> = styled(Primitive.Fallback, 'fallback', false);
export const Image: StyledComponent<typeof Primitive.Image, typeof recipe> = styled(Primitive.Image, 'image', false);
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
