import { code as recipe } from '@flippo-software/component-styles/code';

import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const CodeElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'code'> = styled(
    PresentationElement,
    recipe,
    'code',
    'root',
    true,
    'code'
);
export const elements: typeof CodeElement = CodeElement;
export function define(options: DefineOptions) {
    registerElements('code', elements, options);
}
export type CodeElement = InstanceType<typeof CodeElement>;
