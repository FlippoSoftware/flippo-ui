'use client';
import { accordion as recipe } from '@flippo-software/component-styles/accordion';
import { Accordion as Primitive } from '@flippo-ui/headless-components/accordion';

import { icon } from '../../lib/Icon';
import { createStyler } from '../../lib/Styled';

import type { RecipeVariants, StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'accordion');
export type Variants = RecipeVariants<typeof recipe>;
export const Header: StyledComponent<typeof Primitive.Header, typeof recipe> = styled(Primitive.Header, 'header', false);
export const Item: StyledComponent<typeof Primitive.Item, typeof recipe> = styled(Primitive.Item, 'item', false);
export const Panel: StyledComponent<typeof Primitive.Panel, typeof recipe> = styled(Primitive.Panel, 'panel', false);
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
export const Trigger: StyledComponent<typeof Primitive.Trigger, typeof recipe> = styled(Primitive.Trigger, 'trigger', false);
export const Icon: StyledComponent<'span', typeof recipe> = styled('span', 'icon', false, { defaults: { children: icon('chevron-down') } });
export const Content: StyledComponent<'div', typeof recipe> = styled('div', 'content');
