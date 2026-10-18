'use client';
import { combobox as recipe } from '@flippo-software/component-styles/combobox';
import { Combobox as Primitive } from '@flippo-software/react-components/combobox';

import { icon } from '~@lib/Icon';
import { withAnchor, withAnchorRoot, withAnchorTarget } from '~@lib/InputGroupAnchor';
import { themedPortal } from '~@lib/Provider';
import { createStyler } from '~@lib/Styled';

import type { RecipeVariants, StyledComponent } from '~@lib/Styled';

const styled = createStyler(recipe, 'combobox');
export type Variants = RecipeVariants<typeof recipe>;
export const Separator: StyledComponent<typeof Primitive.Separator, typeof recipe> = styled(Primitive.Separator, 'separator', false);
export const Arrow: StyledComponent<typeof Primitive.Arrow, typeof recipe> = styled(Primitive.Arrow, 'arrow', false);
export const Backdrop: StyledComponent<typeof Primitive.Backdrop, typeof recipe> = styled(Primitive.Backdrop, 'backdrop', false);
export const Chip: StyledComponent<typeof Primitive.Chip, typeof recipe> = styled(Primitive.Chip, 'chip', false);
export const ChipRemove: StyledComponent<typeof Primitive.ChipRemove, typeof recipe> = styled(Primitive.ChipRemove, 'chipRemove', false, {
    defaults: { children: icon('xmark') }
});
export const Chips: StyledComponent<typeof Primitive.Chips, typeof recipe> = styled(Primitive.Chips, 'chips', false);
export const Clear: StyledComponent<typeof Primitive.Clear, typeof recipe> = styled(Primitive.Clear, 'clear', false, {
    defaults: { children: icon('xmark') }
});
export const Collection: typeof Primitive.Collection = Primitive.Collection;
export const Empty: StyledComponent<typeof Primitive.Empty, typeof recipe> = styled(Primitive.Empty, 'empty', false);
export const Group: StyledComponent<typeof Primitive.Group, typeof recipe> = styled(Primitive.Group, 'group', false);
export const GroupLabel: StyledComponent<typeof Primitive.GroupLabel, typeof recipe> = styled(Primitive.GroupLabel, 'groupLabel', false);
export const Icon: StyledComponent<typeof Primitive.Icon, typeof recipe> = styled(Primitive.Icon, 'icon', false);
export const Input: StyledComponent<typeof Primitive.Input, typeof recipe> = styled(Primitive.Input, 'input', false);
export const Item: StyledComponent<typeof Primitive.Item, typeof recipe> = styled(Primitive.Item, 'item', false);
export const ItemIndicator: StyledComponent<typeof Primitive.ItemIndicator, typeof recipe> = styled(
    Primitive.ItemIndicator,
    'itemIndicator',
    false,
    { defaults: { children: icon('check') } }
);
export const List: StyledComponent<typeof Primitive.List, typeof recipe> = styled(Primitive.List, 'list', false);
export const Popup: StyledComponent<typeof Primitive.Popup, typeof recipe> = styled(Primitive.Popup, 'popup', false);
export const Portal: typeof Primitive.Portal = themedPortal(Primitive.Portal) as typeof Primitive.Portal;
export const Positioner: StyledComponent<typeof Primitive.Positioner, typeof recipe> = withAnchor(
    styled(Primitive.Positioner, 'positioner', false, {
        defaults: { sideOffset: 8 }
    })
);
const StyledRoot = withAnchorRoot(styled(Primitive.Root, undefined, true));
export const Root = StyledRoot as <Value, Multiple extends boolean | undefined = false>(
    props: Primitive.Root.Props<Value, Multiple> & Variants
) => React.ReactElement;
export const useFilter: typeof Primitive.useFilter = Primitive.useFilter;
export const Row: StyledComponent<typeof Primitive.Row, typeof recipe> = styled(Primitive.Row, 'row', false);
export const Status: StyledComponent<typeof Primitive.Status, typeof recipe> = styled(Primitive.Status, 'status', false);
export const Trigger: StyledComponent<typeof Primitive.Trigger, typeof recipe> = styled(Primitive.Trigger, 'trigger', false, {
    defaults: { children: icon('chevron-down') }
});
export const Value: StyledComponent<typeof Primitive.Value, typeof recipe> = styled(Primitive.Value, 'value', false);
export const InputGroup: StyledComponent<'div', typeof recipe> = withAnchorTarget(
    styled('div', 'inputGroup', false, { focusControlOnPress: true })
);
export const ChipLabel: StyledComponent<'span', typeof recipe> = styled('span', 'chipLabel');
