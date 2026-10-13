import { strong as recipe } from '@flippo-software/component-styles/strong';

import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const StrongElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'strong'> = styled(
    PresentationElement,
    recipe,
    'strong',
    'root',
    true,
    'strong'
);
export const elements: typeof StrongElement = StrongElement;
export function define(options: DefineOptions) {
    registerElements('strong', elements, options);
}
export type StrongElement = InstanceType<typeof StrongElement>;
