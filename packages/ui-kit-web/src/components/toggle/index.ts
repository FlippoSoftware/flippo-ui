import { toggle as recipe } from '@flippo-software/component-styles/toggle';
import * as Primitive from '@flippo-software/web-components/toggle';

import { registerElements } from '../../lib/register';
import { styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const ToggleElement: StyledConstructor<typeof Primitive.ToggleElement, typeof recipe> = styled(
    Primitive.ToggleElement,
    recipe,
    'toggle',
    'root',
    true
);
export const elements: typeof ToggleElement = ToggleElement;
export function define(options: DefineOptions) {
    registerElements('toggle', elements, options);
}
export type ToggleElement = InstanceType<typeof ToggleElement>;
