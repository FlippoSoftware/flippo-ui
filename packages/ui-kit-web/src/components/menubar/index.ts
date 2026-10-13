import { menubar as recipe } from '@flippo-software/component-styles/menubar';
import { MenuTriggerElement } from '@flippo-software/web-components/menu';
import * as Primitive from '@flippo-software/web-components/menubar';

import { define as defineMenu } from '~@components/menu';
import { registerElements } from '~@lib/register';
import { styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const MenubarElement: StyledConstructor<typeof Primitive.MenubarElement, typeof recipe> = styled(
    Primitive.MenubarElement,
    recipe,
    'menubar',
    'root',
    true
);
export const MenubarTriggerElement: StyledConstructor<typeof MenuTriggerElement, typeof recipe> = styled(
    MenuTriggerElement,
    recipe,
    'menubar',
    'trigger'
);
export const elements: { root: typeof MenubarElement; trigger: typeof MenubarTriggerElement } = {
    root: MenubarElement,
    trigger: MenubarTriggerElement
};
export function define(options: DefineOptions) {
    defineMenu(options);
    registerElements('menubar', elements, options);
}
export type MenubarElement = InstanceType<typeof MenubarElement>;
export type MenubarTriggerElement = InstanceType<typeof MenubarTriggerElement>;
