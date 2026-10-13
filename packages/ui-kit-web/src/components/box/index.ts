import { box as recipe } from '@flippo-software/component-styles/box';

import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const BoxElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'box'> = styled(
    PresentationElement,
    recipe,
    'box',
    'root',
    true,
    'box'
);
export const elements: typeof BoxElement = BoxElement;
export function define(options: DefineOptions) {
    registerElements('box', elements, options);
}
export type BoxElement = InstanceType<typeof BoxElement>;
