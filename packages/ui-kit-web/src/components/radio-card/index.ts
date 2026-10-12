import { radioCard as recipe } from '@flippo-software/component-styles/radio-card';
import * as Primitive from '@flippo-software/web-components/radio-card';

import { registerElements } from '../../lib/register';
import { styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const RadioCardElement: StyledConstructor<typeof Primitive.RadioCardElement, typeof recipe> = styled(
    Primitive.RadioCardElement,
    recipe,
    'radio-card',
    'root',
    true
);
export const RadioCardIndicatorElement: StyledConstructor<typeof Primitive.RadioCardIndicatorElement, typeof recipe> = styled(
    Primitive.RadioCardIndicatorElement,
    recipe,
    'radio-card',
    'indicator',
    false,
    undefined,
    { defaults: { keepMounted: true } }
);
export const elements: { readonly root: typeof RadioCardElement; readonly indicator: typeof RadioCardIndicatorElement } = {
    root: RadioCardElement,
    indicator: RadioCardIndicatorElement
} as const;
export function define(options: DefineOptions) {
    registerElements('radio-card', elements, options);
}
export type RadioCardElement = InstanceType<typeof RadioCardElement>;
export type RadioCardIndicatorElement = InstanceType<typeof RadioCardIndicatorElement>;
