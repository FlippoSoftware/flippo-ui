'use client';
import { menu as recipe } from '@flippo-software/component-styles/menu';
import { Menu as Primitive } from '@flippo-ui/headless-components/menu';

import { icon } from '../../lib/Icon';
import { createStyler } from '../../lib/Styled';

import type { RecipeVariants, StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'menu');
export type Variants = RecipeVariants<typeof recipe>;
export const Separator: StyledComponent<typeof Primitive.Separator, typeof recipe> = styled(Primitive.Separator, 'separator', false);
export const Arrow: StyledComponent<typeof Primitive.Arrow, typeof recipe> = styled(Primitive.Arrow, 'arrow', false);
export const Backdrop: StyledComponent<typeof Primitive.Backdrop, typeof recipe> = styled(Primitive.Backdrop, 'backdrop', false);
export const CheckboxItem: StyledComponent<typeof Primitive.CheckboxItem, typeof recipe> = styled(
    Primitive.CheckboxItem,
    'checkboxItem',
    false
);
export const CheckboxItemIndicator: StyledComponent<typeof Primitive.CheckboxItemIndicator, typeof recipe> = styled(
    Primitive.CheckboxItemIndicator,
    'itemIndicator',
    false,
    { defaults: { children: icon('check') }, part: 'checkboxItemIndicator' }
);
export const Group: StyledComponent<typeof Primitive.Group, typeof recipe> = styled(Primitive.Group, 'group', false);
export const GroupLabel: StyledComponent<typeof Primitive.GroupLabel, typeof recipe> = styled(Primitive.GroupLabel, 'groupLabel', false);
export const Item: StyledComponent<typeof Primitive.Item, typeof recipe> = styled(Primitive.Item, 'item', false);
export const Popup: StyledComponent<typeof Primitive.Popup, typeof recipe> = styled(Primitive.Popup, 'popup', false);
export const Portal: typeof Primitive.Portal = Primitive.Portal;
export const Positioner: StyledComponent<typeof Primitive.Positioner, typeof recipe> = styled(Primitive.Positioner, 'positioner', false, {
    defaults: { sideOffset: 8 }
});
export const RadioGroup: StyledComponent<typeof Primitive.RadioGroup, typeof recipe> = styled(Primitive.RadioGroup, 'radioGroup', false);
export const RadioItem: StyledComponent<typeof Primitive.RadioItem, typeof recipe> = styled(Primitive.RadioItem, 'radioItem', false);
export const RadioItemIndicator: StyledComponent<typeof Primitive.RadioItemIndicator, typeof recipe> = styled(
    Primitive.RadioItemIndicator,
    'itemIndicator',
    false,
    { defaults: { children: icon('check') }, part: 'radioItemIndicator' }
);
const StyledRoot = styled(Primitive.Root, undefined, true);
export const Root = StyledRoot as <Payload = unknown>(props: Primitive.Root.Props<Payload> & Variants) => React.ReactElement;
export const createHandle: typeof Primitive.createHandle = Primitive.createHandle;
export const Handle: typeof Primitive.Handle = Primitive.Handle;
export const SubmenuRoot: typeof Primitive.SubmenuRoot = Primitive.SubmenuRoot;
export const SubmenuTrigger: StyledComponent<typeof Primitive.SubmenuTrigger, typeof recipe> = styled(
    Primitive.SubmenuTrigger,
    'submenuTrigger',
    false
);
export const Trigger: typeof Primitive.Trigger = Primitive.Trigger;
export const LinkItem: StyledComponent<typeof Primitive.Item, typeof recipe> = styled(Primitive.Item, 'linkItem');
export const ItemEnd: StyledComponent<'span', typeof recipe> = styled('span', 'itemEnd');
