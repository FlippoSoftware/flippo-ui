import { container as recipe } from '@flippo-software/component-styles/container';

import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const ContainerElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'container'> = styled(
    PresentationElement,
    recipe,
    'container',
    'root',
    true,
    'container'
);
export const elements: typeof ContainerElement = ContainerElement;
export function define(options: DefineOptions) {
    registerElements('container', elements, options);
}
export type ContainerElement = InstanceType<typeof ContainerElement>;
