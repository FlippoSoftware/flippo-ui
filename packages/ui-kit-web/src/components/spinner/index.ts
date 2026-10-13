import { spinner as recipe } from '@flippo-software/component-styles/spinner';

import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const SpinnerElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'spinner'> = styled(
    PresentationElement,
    recipe,
    'spinner',
    'root',
    true,
    'spinner'
);
export const elements: typeof SpinnerElement = SpinnerElement;
export function define(options: DefineOptions) {
    registerElements('spinner', elements, options);
}
export type SpinnerElement = InstanceType<typeof SpinnerElement>;
