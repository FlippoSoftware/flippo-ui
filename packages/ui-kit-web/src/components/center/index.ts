import { center as recipe } from '@flippo-software/component-styles/center';

import { registerElements } from '../../lib/register';
import { PresentationElement, styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const CenterElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'center'> = styled(
    PresentationElement,
    recipe,
    'center',
    'root',
    true,
    'center'
);
export const elements: typeof CenterElement = CenterElement;
export function define(options: DefineOptions) {
    registerElements('center', elements, options);
}
export type CenterElement = InstanceType<typeof CenterElement>;
