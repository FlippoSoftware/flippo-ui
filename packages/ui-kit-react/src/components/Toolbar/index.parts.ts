'use client';
import { toolbar as recipe } from '@flippo-software/component-styles/toolbar';
import { Toolbar as Primitive } from '@flippo-software/react-components/toolbar';

import { createStyler } from '../../lib/Styled';

import type { RecipeVariants, StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'toolbar');
export type Variants = RecipeVariants<typeof recipe>;
export const Button: StyledComponent<typeof Primitive.Button, typeof recipe> = styled(Primitive.Button, 'button', false);
export const Group: StyledComponent<typeof Primitive.Group, typeof recipe> = styled(Primitive.Group, 'group', false);
export const Input: StyledComponent<typeof Primitive.Input, typeof recipe> = styled(Primitive.Input, 'input', false);
export const Link: StyledComponent<typeof Primitive.Link, typeof recipe> = styled(Primitive.Link, 'link', false);
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
export const Separator: StyledComponent<typeof Primitive.Separator, typeof recipe> = styled(Primitive.Separator, 'separator', false);
