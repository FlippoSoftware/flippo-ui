'use client';
import { meter as recipe } from '@flippo-software/component-styles/meter';
import { Meter as Primitive } from '@flippo-software/react-components/meter';

import { createStyler } from '../../lib/Styled';

import type { RecipeVariants, StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'meter');
export type Variants = RecipeVariants<typeof recipe>;
export const Indicator: StyledComponent<typeof Primitive.Indicator, typeof recipe> = styled(Primitive.Indicator, 'indicator', false);
export const Label: StyledComponent<typeof Primitive.Label, typeof recipe> = styled(Primitive.Label, 'label', false);
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
export const Track: StyledComponent<typeof Primitive.Track, typeof recipe> = styled(Primitive.Track, 'track', false);
export const Value: StyledComponent<typeof Primitive.Value, typeof recipe> = styled(Primitive.Value, 'value', false);
