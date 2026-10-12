'use client';
import { contextMenu as recipe } from '@flippo-software/component-styles/context-menu';
import { ContextMenu as Primitive } from '@flippo-ui/headless-components/context-menu';

import { icon } from '../../lib/Icon';
import { createStyler } from '../../lib/Styled';

import type { RecipeVariants, StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'contextMenu');
export type Variants = RecipeVariants<typeof recipe>;
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
export const SubmenuRoot: typeof Primitive.SubmenuRoot = Primitive.SubmenuRoot;
export const SubmenuTrigger: StyledComponent<typeof Primitive.SubmenuTrigger, typeof recipe> = styled(
    Primitive.SubmenuTrigger,
    'submenuTrigger',
    false
);
export const Separator: StyledComponent<typeof Primitive.Separator, typeof recipe> = styled(Primitive.Separator, 'separator', false);
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
export const Trigger: StyledComponent<typeof Primitive.Trigger, typeof recipe> = styled(Primitive.Trigger, 'trigger', false);
export const LinkItem: StyledComponent<typeof Primitive.Item, typeof recipe> = styled(Primitive.Item, 'linkItem');
export const ItemEnd: StyledComponent<'span', typeof recipe> = styled('span', 'itemEnd');
