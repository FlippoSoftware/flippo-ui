'use client';
import { segmentedControl as recipe } from '@flippo-software/component-styles/segmented-control';
import { SegmentedControl as Primitive } from '@flippo-software/react-components/segmented-control';

import { createStyler } from '../../lib/Styled';

import type { RecipeVariants, StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'segmentedControl');
export type Variants = RecipeVariants<typeof recipe>;
export const Item: StyledComponent<typeof Primitive.Item, typeof recipe> = styled(Primitive.Item, 'item', false);
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
