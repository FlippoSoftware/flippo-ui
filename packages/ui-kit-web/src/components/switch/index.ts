import { switchRecipe as recipe } from '@flippo-software/component-styles/switch';
import * as Primitive from '@flippo-software/web-components/switch';

import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const SwitchElement: StyledConstructor<typeof Primitive.SwitchElement, typeof recipe> = styled(
    Primitive.SwitchElement,
    recipe,
    'switch',
    'root',
    true
);
export const SwitchThumbElement: StyledConstructor<typeof Primitive.SwitchThumbElement, typeof recipe> = styled(
    Primitive.SwitchThumbElement,
    recipe,
    'switch',
    'thumb',
    false
);
export const SwitchLabelElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'switch',
    'label'
);
export const elements: {
    readonly root: typeof SwitchElement;
    readonly thumb: typeof SwitchThumbElement;
    readonly label: typeof SwitchLabelElement;
} = { root: SwitchElement, thumb: SwitchThumbElement, label: SwitchLabelElement } as const;
export function define(options: DefineOptions) {
    registerElements('switch', elements, options);
}
export type SwitchElement = InstanceType<typeof SwitchElement>;
export type SwitchThumbElement = InstanceType<typeof SwitchThumbElement>;
export type SwitchLabelElement = InstanceType<typeof SwitchLabelElement>;
