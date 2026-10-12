import { slider as recipe } from '@flippo-software/component-styles/slider';
import * as Primitive from '@flippo-software/web-components/slider';

import { registerElements } from '../../lib/register';
import { styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const SliderElement: StyledConstructor<typeof Primitive.SliderElement, typeof recipe> = styled(
    Primitive.SliderElement,
    recipe,
    'slider',
    'root',
    true
);
export const SliderValueElement: StyledConstructor<typeof Primitive.SliderValueElement, typeof recipe> = styled(
    Primitive.SliderValueElement,
    recipe,
    'slider',
    'value',
    false
);
export const SliderControlElement: StyledConstructor<typeof Primitive.SliderControlElement, typeof recipe> = styled(
    Primitive.SliderControlElement,
    recipe,
    'slider',
    'control',
    false
);
export const SliderTrackElement: StyledConstructor<typeof Primitive.SliderTrackElement, typeof recipe> = styled(
    Primitive.SliderTrackElement,
    recipe,
    'slider',
    'track',
    false
);
export const SliderIndicatorElement: StyledConstructor<typeof Primitive.SliderIndicatorElement, typeof recipe> = styled(
    Primitive.SliderIndicatorElement,
    recipe,
    'slider',
    'indicator',
    false
);
export const SliderThumbElement: StyledConstructor<typeof Primitive.SliderThumbElement, typeof recipe> = styled(
    Primitive.SliderThumbElement,
    recipe,
    'slider',
    'thumb',
    false
);
export const elements: {
    readonly root: typeof SliderElement;
    readonly value: typeof SliderValueElement;
    readonly control: typeof SliderControlElement;
    readonly track: typeof SliderTrackElement;
    readonly indicator: typeof SliderIndicatorElement;
    readonly thumb: typeof SliderThumbElement;
} = {
    root: SliderElement,
    value: SliderValueElement,
    control: SliderControlElement,
    track: SliderTrackElement,
    indicator: SliderIndicatorElement,
    thumb: SliderThumbElement
} as const;
export function define(options: DefineOptions) {
    registerElements('slider', elements, options);
}
export type SliderElement = InstanceType<typeof SliderElement>;
export type SliderValueElement = InstanceType<typeof SliderValueElement>;
export type SliderControlElement = InstanceType<typeof SliderControlElement>;
export type SliderTrackElement = InstanceType<typeof SliderTrackElement>;
export type SliderIndicatorElement = InstanceType<typeof SliderIndicatorElement>;
export type SliderThumbElement = InstanceType<typeof SliderThumbElement>;
