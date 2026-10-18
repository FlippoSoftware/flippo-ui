'use client';
import { drawer as recipe } from '@flippo-software/component-styles/drawer';
import { Drawer as Primitive } from '@flippo-software/react-components/drawer';

import { icon } from '~@lib/Icon';
import { themedPortal } from '~@lib/Provider';
import { createStyler } from '~@lib/Styled';

import type { RecipeVariants, StyledComponent } from '~@lib/Styled';

const styled = createStyler(recipe, 'drawer');
export type Variants = RecipeVariants<typeof recipe>;
export const Backdrop: StyledComponent<typeof Primitive.Backdrop, typeof recipe> = styled(Primitive.Backdrop, 'backdrop', false);
export const Close: StyledComponent<typeof Primitive.Close, typeof recipe> = styled(Primitive.Close, 'close', false, {
    bareWhenRendered: true,
    defaults: { children: icon('xmark') }
});
export const Description: StyledComponent<typeof Primitive.Description, typeof recipe> = styled(
    Primitive.Description,
    'description',
    false
);
export const Drag: StyledComponent<typeof Primitive.Drag, typeof recipe> = styled(Primitive.Drag, 'drag', false);
export const Popup: StyledComponent<typeof Primitive.Popup, typeof recipe> = styled(Primitive.Popup, 'popup', false);
export const Portal: typeof Primitive.Portal = themedPortal(Primitive.Portal) as typeof Primitive.Portal;
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
export const Title: StyledComponent<typeof Primitive.Title, typeof recipe> = styled(Primitive.Title, 'title', false);
export const Trigger: typeof Primitive.Trigger = Primitive.Trigger;
export const Viewport: typeof Primitive.Viewport = Primitive.Viewport;
export const Actions: StyledComponent<'div', typeof recipe> = styled('div', 'actions');
