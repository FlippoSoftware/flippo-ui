'use client';
import { slider as recipe } from '@flippo-software/component-styles/slider';
import { Slider as Primitive } from '@flippo-software/react-components/slider';

import { createStyler } from '../../lib/Styled';

import type { RecipeVariants, StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'slider');
export type Variants = RecipeVariants<typeof recipe>;
export const Control: StyledComponent<typeof Primitive.Control, typeof recipe> = styled(Primitive.Control, 'control', false);
export const Indicator: StyledComponent<typeof Primitive.Indicator, typeof recipe> = styled(Primitive.Indicator, 'indicator', false);
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
export const Thumb: StyledComponent<typeof Primitive.Thumb, typeof recipe> = styled(Primitive.Thumb, 'thumb', false);
export const Track: StyledComponent<typeof Primitive.Track, typeof recipe> = styled(Primitive.Track, 'track', false);
export const Value: StyledComponent<typeof Primitive.Value, typeof recipe> = styled(Primitive.Value, 'value', false);
