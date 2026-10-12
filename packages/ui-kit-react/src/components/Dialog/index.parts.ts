'use client';
import { dialog as recipe } from '@flippo-software/component-styles/dialog';
import { Dialog as Primitive } from '@flippo-software/react-components/dialog';

import { icon } from '../../lib/Icon';
import { createStyler } from '../../lib/Styled';

import type { RecipeVariants, StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'dialog');
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
export const Popup: StyledComponent<typeof Primitive.Popup, typeof recipe> = styled(Primitive.Popup, 'popup', false);
export const Portal: typeof Primitive.Portal = Primitive.Portal;
const StyledRoot = styled(Primitive.Root, undefined, true);
export const Root = StyledRoot as <Payload = unknown>(props: Primitive.Root.Props<Payload> & Variants) => React.ReactElement;
export const createHandle: typeof Primitive.createHandle = Primitive.createHandle;
export const Handle: typeof Primitive.Handle = Primitive.Handle;
export const Title: StyledComponent<typeof Primitive.Title, typeof recipe> = styled(Primitive.Title, 'title', false);
export const Trigger: typeof Primitive.Trigger = Primitive.Trigger;
export const Viewport: typeof Primitive.Viewport = Primitive.Viewport;
export const Actions: StyledComponent<'div', typeof recipe> = styled('div', 'actions');
