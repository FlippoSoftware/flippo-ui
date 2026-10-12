'use client';
import { fieldset as recipe } from '@flippo-software/component-styles/fieldset';
import { Fieldset as Primitive } from '@flippo-software/react-components/fieldset';

import { createStyler } from '../../lib/Styled';

import type { RecipeVariants, StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'fieldset');
export type Variants = RecipeVariants<typeof recipe>;
export const Legend: StyledComponent<typeof Primitive.Legend, typeof recipe> = styled(Primitive.Legend, 'legend', false);
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
