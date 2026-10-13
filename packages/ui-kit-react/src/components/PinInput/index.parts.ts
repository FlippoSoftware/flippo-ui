'use client';
import { pinInput as recipe } from '@flippo-software/component-styles/pin-input';
import { PinInput as Primitive } from '@flippo-software/react-components/pin-input';

import { createStyler } from '~@lib/Styled';

import type { RecipeVariants, StyledComponent } from '~@lib/Styled';

const styled = createStyler(recipe, 'pinInput');
export type Variants = RecipeVariants<typeof recipe>;
export const FocusFunnel: StyledComponent<typeof Primitive.FocusFunnel, typeof recipe> = styled(
    Primitive.FocusFunnel,
    'focusFunnel',
    false
);
export const Group: StyledComponent<typeof Primitive.Group, typeof recipe> = styled(Primitive.Group, 'group', false);
export const Pin: StyledComponent<typeof Primitive.Pin, typeof recipe> = styled(Primitive.Pin, 'pin', false);
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true, {
    defaults: { placeholder: '' }
});
