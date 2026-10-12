import { link as recipe } from '@flippo-software/component-styles/link';

import { registerElements } from '../../lib/register';
import { PresentationElement, styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const LinkElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'link'> = styled(
    PresentationElement,
    recipe,
    'link',
    'root',
    true,
    'link'
);
export const elements: typeof LinkElement = LinkElement;
export function define(options: DefineOptions) {
    registerElements('link', elements, options);
}
export type LinkElement = InstanceType<typeof LinkElement>;
