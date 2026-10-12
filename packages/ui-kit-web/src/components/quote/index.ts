import { quote as recipe } from '@flippo-software/component-styles/quote';

import { registerElements } from '../../lib/register';
import { PresentationElement, styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const QuoteElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'quote'> = styled(
    PresentationElement,
    recipe,
    'quote',
    'root',
    true,
    'quote'
);
export const elements: typeof QuoteElement = QuoteElement;
export function define(options: DefineOptions) {
    registerElements('quote', elements, options);
}
export type QuoteElement = InstanceType<typeof QuoteElement>;
