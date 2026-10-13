import { section as recipe } from '@flippo-software/component-styles/section';

import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const SectionElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'section'> = styled(
    PresentationElement,
    recipe,
    'section',
    'root',
    true,
    'section'
);
export const elements: typeof SectionElement = SectionElement;
export function define(options: DefineOptions) {
    registerElements('section', elements, options);
}
export type SectionElement = InstanceType<typeof SectionElement>;
