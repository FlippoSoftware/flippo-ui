import { toolbar as recipe } from '@flippo-software/component-styles/toolbar';
import * as Primitive from '@flippo-software/web-components/toolbar';

import { registerElements } from '../../lib/register';
import { styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const ToolbarElement: StyledConstructor<typeof Primitive.ToolbarElement, typeof recipe> = styled(
    Primitive.ToolbarElement,
    recipe,
    'toolbar',
    'root',
    true
);
export const ToolbarGroupElement: StyledConstructor<typeof Primitive.ToolbarGroupElement, typeof recipe> = styled(
    Primitive.ToolbarGroupElement,
    recipe,
    'toolbar',
    'group',
    false
);
export const ToolbarButtonElement: StyledConstructor<typeof Primitive.ToolbarButtonElement, typeof recipe> = styled(
    Primitive.ToolbarButtonElement,
    recipe,
    'toolbar',
    'button',
    false
);
export const ToolbarLinkElement: StyledConstructor<typeof Primitive.ToolbarLinkElement, typeof recipe> = styled(
    Primitive.ToolbarLinkElement,
    recipe,
    'toolbar',
    'link',
    false
);
export const ToolbarInputElement: StyledConstructor<typeof Primitive.ToolbarInputElement, typeof recipe> = styled(
    Primitive.ToolbarInputElement,
    recipe,
    'toolbar',
    'input',
    false
);
export const ToolbarSeparatorElement: StyledConstructor<typeof Primitive.ToolbarSeparatorElement, typeof recipe> = styled(
    Primitive.ToolbarSeparatorElement,
    recipe,
    'toolbar',
    'separator',
    false
);
export const elements: {
    readonly root: typeof ToolbarElement;
    readonly group: typeof ToolbarGroupElement;
    readonly button: typeof ToolbarButtonElement;
    readonly link: typeof ToolbarLinkElement;
    readonly input: typeof ToolbarInputElement;
    readonly separator: typeof ToolbarSeparatorElement;
} = {
    root: ToolbarElement,
    group: ToolbarGroupElement,
    button: ToolbarButtonElement,
    link: ToolbarLinkElement,
    input: ToolbarInputElement,
    separator: ToolbarSeparatorElement
} as const;
export function define(options: DefineOptions) {
    registerElements('toolbar', elements, options);
}
export type ToolbarElement = InstanceType<typeof ToolbarElement>;
export type ToolbarGroupElement = InstanceType<typeof ToolbarGroupElement>;
export type ToolbarButtonElement = InstanceType<typeof ToolbarButtonElement>;
export type ToolbarLinkElement = InstanceType<typeof ToolbarLinkElement>;
export type ToolbarInputElement = InstanceType<typeof ToolbarInputElement>;
export type ToolbarSeparatorElement = InstanceType<typeof ToolbarSeparatorElement>;
