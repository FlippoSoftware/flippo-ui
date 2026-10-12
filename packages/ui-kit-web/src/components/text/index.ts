import { text as recipe } from '@flippo-software/component-styles/text';

import { registerElements } from '../../lib/register';
import { PresentationElement, styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const TextElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'text'> = styled(
    PresentationElement,
    recipe,
    'text',
    'root',
    true,
    'text'
);
export const elements: typeof TextElement = TextElement;
export function define(options: DefineOptions) {
    registerElements('text', elements, options);
}
export type TextElement = InstanceType<typeof TextElement>;
