import { kbd as recipe } from '@flippo-software/component-styles/kbd';

import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const KbdElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'kbd'> = styled(
    PresentationElement,
    recipe,
    'kbd',
    'root',
    true,
    'kbd'
);
export const elements: typeof KbdElement = KbdElement;
export function define(options: DefineOptions) {
    registerElements('kbd', elements, options);
}
export type KbdElement = InstanceType<typeof KbdElement>;
