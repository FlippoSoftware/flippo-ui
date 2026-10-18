'use client';
import { navigationMenu as recipe } from '@flippo-software/component-styles/navigation-menu';
import { NavigationMenu as Primitive } from '@flippo-software/react-components/navigation-menu';

import { icon } from '~@lib/Icon';
import { themedPortal } from '~@lib/Provider';
import { createStyler } from '~@lib/Styled';

import type { RecipeVariants, StyledComponent } from '~@lib/Styled';

const styled = createStyler(recipe, 'navigationMenu');
export type Variants = RecipeVariants<typeof recipe>;
export const Arrow: StyledComponent<typeof Primitive.Arrow, typeof recipe> = styled(Primitive.Arrow, 'arrow', false);
export const Backdrop: StyledComponent<typeof Primitive.Backdrop, typeof recipe> = styled(Primitive.Backdrop, 'backdrop', false);
export const Content: StyledComponent<typeof Primitive.Content, typeof recipe> = styled(Primitive.Content, 'content', false);
export const Icon: StyledComponent<typeof Primitive.Icon, typeof recipe> = styled(Primitive.Icon, 'icon', false, {
    defaults: { children: icon('chevron-down') }
});
export const Item: StyledComponent<typeof Primitive.Item, typeof recipe> = styled(Primitive.Item, 'item', false);
export const Link: StyledComponent<typeof Primitive.Link, typeof recipe> = styled(Primitive.Link, 'link', false);
export const List: StyledComponent<typeof Primitive.List, typeof recipe> = styled(Primitive.List, 'list', false);
export const Popup: StyledComponent<typeof Primitive.Popup, typeof recipe> = styled(Primitive.Popup, 'popup', false);
export const Portal: typeof Primitive.Portal = themedPortal(Primitive.Portal) as typeof Primitive.Portal;
export const Positioner: StyledComponent<typeof Primitive.Positioner, typeof recipe> = styled(Primitive.Positioner, 'positioner', false, {
    defaults: { sideOffset: 8 }
});
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
export const Trigger: StyledComponent<typeof Primitive.Trigger, typeof recipe> = styled(Primitive.Trigger, 'trigger', false);
export const Viewport: StyledComponent<typeof Primitive.Viewport, typeof recipe> = styled(Primitive.Viewport, 'viewport', false);
export const LinkDescription: StyledComponent<'div', typeof recipe> = styled('div', 'linkDescription');
