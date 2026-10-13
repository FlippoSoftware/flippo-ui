import { button as recipe } from '@flippo-software/component-styles/button';
import * as Primitive from '@flippo-software/web-components/button';

import { registerElements } from '~@lib/register';
import { styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const ButtonElement: StyledConstructor<typeof Primitive.ButtonElement, typeof recipe> = styled(
    Primitive.ButtonElement,
    recipe,
    'button',
    'root',
    true
);
export const elements: typeof ButtonElement = ButtonElement;
export function define(options: DefineOptions) {
    registerElements('button', elements, options);
}
export type ButtonElement = InstanceType<typeof ButtonElement>;
