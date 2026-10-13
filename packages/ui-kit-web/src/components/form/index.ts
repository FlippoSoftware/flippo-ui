import { form as recipe } from '@flippo-software/component-styles/form';
import * as Primitive from '@flippo-software/web-components/form';

import { registerElements } from '~@lib/register';
import { styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const FormElement: StyledConstructor<typeof Primitive.FormElement, typeof recipe> = styled(
    Primitive.FormElement,
    recipe,
    'form',
    'root',
    true
);
export const elements: typeof FormElement = FormElement;
export function define(options: DefineOptions) {
    registerElements('form', elements, options);
}
export type FormElement = InstanceType<typeof FormElement>;
