'use client';
import { field as recipe } from '@flippo-software/component-styles/field';
import { Field as Primitive } from '@flippo-ui/headless-components/field';

import { createStyler } from '../../lib/Styled';

import type { RecipeVariants, StyledComponent } from '../../lib/Styled';

import { FieldControl } from './FieldControl';

const styled = createStyler(recipe, 'field');
export type Variants = RecipeVariants<typeof recipe>;
export const Control: StyledComponent<typeof FieldControl, typeof recipe> = styled(FieldControl, 'control', false);
export const Description: StyledComponent<typeof Primitive.Description, typeof recipe> = styled(
    Primitive.Description,
    'description',
    false
);
const ErrorPart: StyledComponent<typeof Primitive.Error, typeof recipe> = styled(Primitive.Error, 'error', false);
export const Item: StyledComponent<typeof Primitive.Item, typeof recipe> = styled(Primitive.Item, 'item', false);
export const Label: StyledComponent<typeof Primitive.Label, typeof recipe> = styled(Primitive.Label, 'label', false);
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
export const Validity: typeof Primitive.Validity = Primitive.Validity;
export { ErrorPart as Error };
