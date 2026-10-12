'use client';
import { tabs as recipe } from '@flippo-software/component-styles/tabs';
import { Tabs as Primitive } from '@flippo-ui/headless-components/tabs';

import { createStyler } from '../../lib/Styled';

import type { RecipeVariants, StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'tabs');
export type Variants = RecipeVariants<typeof recipe>;
export const Indicator: StyledComponent<typeof Primitive.Indicator, typeof recipe> = styled(Primitive.Indicator, 'indicator', false);
export const List: StyledComponent<typeof Primitive.List, typeof recipe> = styled(Primitive.List, 'list', false);
export const Panel: StyledComponent<typeof Primitive.Panel, typeof recipe> = styled(Primitive.Panel, 'panel', false);
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
export const Tab: StyledComponent<typeof Primitive.Tab, typeof recipe> = styled(Primitive.Tab, 'tab', false);
export const Count: StyledComponent<'span', typeof recipe> = styled('span', 'count');
