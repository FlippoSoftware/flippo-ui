import { checkboxCard as recipe } from '@flippo-software/component-styles/checkbox-card';
import * as Primitive from '@flippo-software/web-components/checkbox-card';

import { CHECK_MARKUP } from '../../lib/icons';
import { registerElements } from '../../lib/register';
import { styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const CheckboxCardElement: StyledConstructor<typeof Primitive.CheckboxCardElement, typeof recipe> = styled(
    Primitive.CheckboxCardElement,
    recipe,
    'checkbox-card',
    'root',
    true
);
export const CheckboxCardIndicatorElement: StyledConstructor<typeof Primitive.CheckboxCardIndicatorElement, typeof recipe> = styled(
    Primitive.CheckboxCardIndicatorElement,
    recipe,
    'checkbox-card',
    'indicator',
    false,
    undefined,
    { defaults: { keepMounted: true }, content: CHECK_MARKUP }
);
export const elements: { readonly root: typeof CheckboxCardElement; readonly indicator: typeof CheckboxCardIndicatorElement } = {
    root: CheckboxCardElement,
    indicator: CheckboxCardIndicatorElement
} as const;
export function define(options: DefineOptions) {
    registerElements('checkbox-card', elements, options);
}
export type CheckboxCardElement = InstanceType<typeof CheckboxCardElement>;
export type CheckboxCardIndicatorElement = InstanceType<typeof CheckboxCardIndicatorElement>;
