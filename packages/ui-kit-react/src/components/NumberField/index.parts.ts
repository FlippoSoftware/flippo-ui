'use client';
import { numberField as recipe } from '@flippo-software/component-styles/number-field';
import { NumberField as Primitive } from '@flippo-software/react-components/number-field';

import { icon } from '~@lib/Icon';
import { createStyler } from '~@lib/Styled';

import type { RecipeVariants, StyledComponent } from '~@lib/Styled';

const styled = createStyler(recipe, 'numberField');
export type Variants = RecipeVariants<typeof recipe>;
export const Decrement: StyledComponent<typeof Primitive.Decrement, typeof recipe> = styled(Primitive.Decrement, 'decrement', false, {
    defaults: { children: icon('minus') }
});
export const Group: StyledComponent<typeof Primitive.Group, typeof recipe> = styled(Primitive.Group, 'group', false, {
    focusControlOnPress: true
});
export const Increment: StyledComponent<typeof Primitive.Increment, typeof recipe> = styled(Primitive.Increment, 'increment', false, {
    defaults: { children: icon('plus') }
});
export const Input: StyledComponent<typeof Primitive.Input, typeof recipe> = styled(Primitive.Input, 'input', false);
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
export const ScrubArea: StyledComponent<typeof Primitive.ScrubArea, typeof recipe> = styled(Primitive.ScrubArea, 'scrubArea', false);
export const ScrubAreaCursor: StyledComponent<typeof Primitive.ScrubAreaCursor, typeof recipe> = styled(
    Primitive.ScrubAreaCursor,
    'scrubAreaCursor',
    false
);
