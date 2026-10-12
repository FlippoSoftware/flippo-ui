import { radioGroup as recipe } from '@flippo-software/component-styles/radio-group';
import * as Primitive from '@flippo-software/web-components/radio-group';

import { registerElements } from '../../lib/register';
import { styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const RadioGroupElement: StyledConstructor<typeof Primitive.RadioGroupElement, typeof recipe> = styled(
    Primitive.RadioGroupElement,
    recipe,
    'radio-group',
    'root',
    true
);
export const elements: typeof RadioGroupElement = RadioGroupElement;
export function define(options: DefineOptions) {
    registerElements('radio-group', elements, options);
}
export type RadioGroupElement = InstanceType<typeof RadioGroupElement>;
