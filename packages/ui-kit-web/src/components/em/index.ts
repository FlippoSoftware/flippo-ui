import { em as recipe } from '@flippo-software/component-styles/em';

import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const EmElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'em'> = styled(
    PresentationElement,
    recipe,
    'em',
    'root',
    true,
    'em'
);
export const elements: typeof EmElement = EmElement;
export function define(options: DefineOptions) {
    registerElements('em', elements, options);
}
export type EmElement = InstanceType<typeof EmElement>;
