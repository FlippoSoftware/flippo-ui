import { checkboxGroup as recipe } from '@flippo-software/component-styles/checkbox-group';
import * as Primitive from '@flippo-software/web-components/checkbox-group';

import { registerElements } from '~@lib/register';
import { styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const CheckboxGroupElement: StyledConstructor<typeof Primitive.CheckboxGroupElement, typeof recipe> = styled(
    Primitive.CheckboxGroupElement,
    recipe,
    'checkbox-group',
    'root',
    true
);
export const elements: typeof CheckboxGroupElement = CheckboxGroupElement;
export function define(options: DefineOptions) {
    registerElements('checkbox-group', elements, options);
}
export type CheckboxGroupElement = InstanceType<typeof CheckboxGroupElement>;
