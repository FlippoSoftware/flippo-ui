'use client';
import { scrollArea as recipe } from '@flippo-software/component-styles/scroll-area';
import { ScrollArea as Primitive } from '@flippo-ui/headless-components/scroll-area';

import { createStyler } from '../../lib/Styled';

import type { RecipeVariants, StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'scrollArea');
export type Variants = RecipeVariants<typeof recipe>;
export const Content: StyledComponent<typeof Primitive.Content, typeof recipe> = styled(Primitive.Content, 'content', false);
export const Corner: StyledComponent<typeof Primitive.Corner, typeof recipe> = styled(Primitive.Corner, 'corner', false);
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
export const Scrollbar: StyledComponent<typeof Primitive.Scrollbar, typeof recipe> = styled(Primitive.Scrollbar, 'scrollbar', false);
export const Thumb: StyledComponent<typeof Primitive.Thumb, typeof recipe> = styled(Primitive.Thumb, 'thumb', false);
export const Viewport: StyledComponent<typeof Primitive.Viewport, typeof recipe> = styled(Primitive.Viewport, 'viewport', false);
