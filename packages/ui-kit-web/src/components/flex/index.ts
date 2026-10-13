import { flex as recipe } from '@flippo-software/component-styles/flex';

import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const FlexElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'flex'> = styled(
    PresentationElement,
    recipe,
    'flex',
    'root',
    true,
    'flex'
);
export const elements: typeof FlexElement = FlexElement;
export function define(options: DefineOptions) {
    registerElements('flex', elements, options);
}
export type FlexElement = InstanceType<typeof FlexElement>;
