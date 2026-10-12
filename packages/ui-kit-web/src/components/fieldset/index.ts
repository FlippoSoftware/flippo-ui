import { fieldset as recipe } from '@flippo-software/component-styles/fieldset';
import * as Primitive from '@flippo-software/web-components/fieldset';

import { registerElements } from '../../lib/register';
import { styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const FieldsetElement: StyledConstructor<typeof Primitive.FieldsetElement, typeof recipe> = styled(
    Primitive.FieldsetElement,
    recipe,
    'fieldset',
    'root',
    true
);
export const FieldsetLegendElement: StyledConstructor<typeof Primitive.FieldsetLegendElement, typeof recipe> = styled(
    Primitive.FieldsetLegendElement,
    recipe,
    'fieldset',
    'legend',
    false
);
export const elements: { readonly root: typeof FieldsetElement; readonly legend: typeof FieldsetLegendElement } = {
    root: FieldsetElement,
    legend: FieldsetLegendElement
} as const;
export function define(options: DefineOptions) {
    registerElements('fieldset', elements, options);
}
export type FieldsetElement = InstanceType<typeof FieldsetElement>;
export type FieldsetLegendElement = InstanceType<typeof FieldsetLegendElement>;
