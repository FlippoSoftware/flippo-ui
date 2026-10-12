'use client';
import { marquee as recipe } from '@flippo-software/component-styles/marquee';
import { Marquee as Primitive } from '@flippo-ui/headless-components/marquee';

import { createStyler } from '../../lib/Styled';

import type { RecipeVariants, StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'marquee');
export type Variants = RecipeVariants<typeof recipe>;
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
export const Track: StyledComponent<typeof Primitive.Track, typeof recipe> = styled(Primitive.Track, 'track', false);
