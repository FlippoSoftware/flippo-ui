import { blockquote as recipe } from '@flippo-software/component-styles/blockquote';

import { registerElements } from '../../lib/register';
import { PresentationElement, styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const BlockquoteElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'blockquote'> = styled(
    PresentationElement,
    recipe,
    'blockquote',
    'root',
    true,
    'blockquote'
);
export const elements: typeof BlockquoteElement = BlockquoteElement;
export function define(options: DefineOptions) {
    registerElements('blockquote', elements, options);
}
export type BlockquoteElement = InstanceType<typeof BlockquoteElement>;
