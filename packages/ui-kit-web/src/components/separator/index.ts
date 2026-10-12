import { separator as recipe } from '@flippo-software/component-styles/separator';
import * as Primitive from '@flippo-software/web-components/separator';

import { registerElements } from '../../lib/register';
import { styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const SeparatorElement: StyledConstructor<typeof Primitive.SeparatorElement, typeof recipe> = styled(
    Primitive.SeparatorElement,
    recipe,
    'separator',
    'root',
    true
);
export const elements: typeof SeparatorElement = SeparatorElement;
export function define(options: DefineOptions) {
    registerElements('separator', elements, options);
}
export type SeparatorElement = InstanceType<typeof SeparatorElement>;
