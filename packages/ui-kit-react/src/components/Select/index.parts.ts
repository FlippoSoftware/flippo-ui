'use client';
import { select as recipe } from '@flippo-software/component-styles/select';
import { Select as Primitive } from '@flippo-software/react-components/select';

import { icon } from '~@lib/Icon';
import { themedPortal } from '~@lib/Provider';
import { createStyler } from '~@lib/Styled';

import type { RecipeVariants, StyledComponent } from '~@lib/Styled';

const styled = createStyler(recipe, 'select');
export type Variants = RecipeVariants<typeof recipe>;
export const Separator: StyledComponent<typeof Primitive.Separator, typeof recipe> = styled(Primitive.Separator, 'separator', false);
export const Arrow: StyledComponent<typeof Primitive.Arrow, typeof recipe> = styled(Primitive.Arrow, 'arrow', false);
export const Backdrop: StyledComponent<typeof Primitive.Backdrop, typeof recipe> = styled(Primitive.Backdrop, 'backdrop', false);
export const Group: StyledComponent<typeof Primitive.Group, typeof recipe> = styled(Primitive.Group, 'group', false);
export const GroupLabel: StyledComponent<typeof Primitive.GroupLabel, typeof recipe> = styled(Primitive.GroupLabel, 'groupLabel', false);
export const Icon: StyledComponent<typeof Primitive.Icon, typeof recipe> = styled(Primitive.Icon, 'icon', false, {
    defaults: { children: icon('chevron-down') }
});
export const Item: StyledComponent<typeof Primitive.Item, typeof recipe> = styled(Primitive.Item, 'item', false);
export const ItemIndicator: StyledComponent<typeof Primitive.ItemIndicator, typeof recipe> = styled(
    Primitive.ItemIndicator,
    'itemIndicator',
    false,
    { defaults: { children: icon('check') } }
);
export const ItemText: StyledComponent<typeof Primitive.ItemText, typeof recipe> = styled(Primitive.ItemText, 'itemText', false);
export const Popup: StyledComponent<typeof Primitive.Popup, typeof recipe> = styled(Primitive.Popup, 'popup', false);
export const Portal: typeof Primitive.Portal = themedPortal(Primitive.Portal) as typeof Primitive.Portal;
export const Positioner: StyledComponent<typeof Primitive.Positioner, typeof recipe> = styled(Primitive.Positioner, 'positioner', false, {
    defaults: { sideOffset: 8, alignItemWithTrigger: false }
});
const StyledRoot = styled(Primitive.Root, undefined, true);
export const Root = StyledRoot as <Value, Multiple extends boolean | undefined = false>(
    props: Primitive.Root.Props<Value, Multiple> & Variants
) => React.ReactElement;
export const ScrollDownArrow: StyledComponent<typeof Primitive.ScrollDownArrow, typeof recipe> = styled(
    Primitive.ScrollDownArrow,
    'scrollDownArrow',
    false,
    { defaults: { children: icon('chevron-down') } }
);
export const ScrollUpArrow: StyledComponent<typeof Primitive.ScrollUpArrow, typeof recipe> = styled(
    Primitive.ScrollUpArrow,
    'scrollUpArrow',
    false,
    { defaults: { children: icon('chevron-up') } }
);
export const Trigger: StyledComponent<typeof Primitive.Trigger, typeof recipe> = styled(Primitive.Trigger, 'trigger', false);
export const Value: StyledComponent<typeof Primitive.Value, typeof recipe> = styled(Primitive.Value, 'value', false);
export const List: StyledComponent<'div', typeof recipe> = styled('div', 'list');
