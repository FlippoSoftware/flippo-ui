import { toggleGroup as recipe } from '@flippo-software/component-styles/toggle-group';
import * as Primitive from '@flippo-software/web-components/toggle-group';

import { registerElements } from '~@lib/register';
import { styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const ToggleGroupElement: StyledConstructor<typeof Primitive.ToggleGroupElement, typeof recipe> = styled(
    Primitive.ToggleGroupElement,
    recipe,
    'toggle-group',
    'root',
    true
);
export const elements: typeof ToggleGroupElement = ToggleGroupElement;
export function define(options: DefineOptions) {
    registerElements('toggle-group', elements, options);
}
export type ToggleGroupElement = InstanceType<typeof ToggleGroupElement>;
