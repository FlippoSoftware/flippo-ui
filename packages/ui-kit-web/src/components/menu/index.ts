import { iconMarkup } from '@flippo-software/component-styles/icons';
import { menu as recipe } from '@flippo-software/component-styles/menu';
import * as Primitive from '@flippo-software/web-components/menu';

import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const MenuElement: StyledConstructor<typeof Primitive.MenuElement, typeof recipe> = styled(
    Primitive.MenuElement,
    recipe,
    'menu',
    'root',
    true
);
export const MenuTriggerElement: StyledConstructor<typeof Primitive.MenuTriggerElement, typeof recipe> = styled(
    Primitive.MenuTriggerElement,
    recipe,
    'menu',
    'trigger',
    false
);
export const MenuBackdropElement: StyledConstructor<typeof Primitive.MenuBackdropElement, typeof recipe> = styled(
    Primitive.MenuBackdropElement,
    recipe,
    'menu',
    'backdrop',
    false
);
export const MenuPositionerElement: StyledConstructor<typeof Primitive.MenuPositionerElement, typeof recipe> = styled(
    Primitive.MenuPositionerElement,
    recipe,
    'menu',
    'positioner',
    false,
    undefined,
    { defaults: { sideOffset: 8 } }
);
export const MenuPopupElement: StyledConstructor<typeof Primitive.MenuPopupElement, typeof recipe> = styled(
    Primitive.MenuPopupElement,
    recipe,
    'menu',
    'popup',
    false
);
export const MenuArrowElement: StyledConstructor<typeof Primitive.MenuArrowElement, typeof recipe> = styled(
    Primitive.MenuArrowElement,
    recipe,
    'menu',
    'arrow',
    false
);
export const MenuItemElement: StyledConstructor<typeof Primitive.MenuItemElement, typeof recipe> = styled(
    Primitive.MenuItemElement,
    recipe,
    'menu',
    'item',
    false
);
export const MenuLinkItemElement: StyledConstructor<typeof Primitive.MenuLinkItemElement, typeof recipe> = styled(
    Primitive.MenuLinkItemElement,
    recipe,
    'menu',
    'linkItem',
    false
);
export const MenuSubmenuElement: StyledConstructor<typeof Primitive.MenuSubmenuElement, typeof recipe> = styled(
    Primitive.MenuSubmenuElement,
    recipe,
    'menu',
    'submenu',
    false
);
export const MenuSubmenuTriggerElement: StyledConstructor<typeof Primitive.MenuSubmenuTriggerElement, typeof recipe> = styled(
    Primitive.MenuSubmenuTriggerElement,
    recipe,
    'menu',
    'submenuTrigger',
    false
);
export const MenuCheckboxItemElement: StyledConstructor<typeof Primitive.MenuCheckboxItemElement, typeof recipe> = styled(
    Primitive.MenuCheckboxItemElement,
    recipe,
    'menu',
    'checkboxItem',
    false
);
export const MenuRadioGroupElement: StyledConstructor<typeof Primitive.MenuRadioGroupElement, typeof recipe> = styled(
    Primitive.MenuRadioGroupElement,
    recipe,
    'menu',
    'radioGroup',
    false
);
export const MenuRadioItemElement: StyledConstructor<typeof Primitive.MenuRadioItemElement, typeof recipe> = styled(
    Primitive.MenuRadioItemElement,
    recipe,
    'menu',
    'radioItem',
    false
);
export const MenuItemIndicatorElement: StyledConstructor<typeof Primitive.MenuItemIndicatorElement, typeof recipe> = styled(
    Primitive.MenuItemIndicatorElement,
    recipe,
    'menu',
    'itemIndicator',
    false,
    undefined,
    { content: iconMarkup('check') }
);
export const MenuGroupElement: StyledConstructor<typeof Primitive.MenuGroupElement, typeof recipe> = styled(
    Primitive.MenuGroupElement,
    recipe,
    'menu',
    'group',
    false
);
export const MenuGroupLabelElement: StyledConstructor<typeof Primitive.MenuGroupLabelElement, typeof recipe> = styled(
    Primitive.MenuGroupLabelElement,
    recipe,
    'menu',
    'groupLabel',
    false
);
export const MenuItemEndElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'menu',
    'itemEnd'
);
export const MenuSeparatorElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'menu',
    'separator'
);
export const elements: {
    readonly root: typeof MenuElement;
    readonly trigger: typeof MenuTriggerElement;
    readonly backdrop: typeof MenuBackdropElement;
    readonly positioner: typeof MenuPositionerElement;
    readonly popup: typeof MenuPopupElement;
    readonly arrow: typeof MenuArrowElement;
    readonly item: typeof MenuItemElement;
    readonly linkItem: typeof MenuLinkItemElement;
    readonly submenu: typeof MenuSubmenuElement;
    readonly submenuTrigger: typeof MenuSubmenuTriggerElement;
    readonly checkboxItem: typeof MenuCheckboxItemElement;
    readonly radioGroup: typeof MenuRadioGroupElement;
    readonly radioItem: typeof MenuRadioItemElement;
    readonly itemIndicator: typeof MenuItemIndicatorElement;
    readonly group: typeof MenuGroupElement;
    readonly groupLabel: typeof MenuGroupLabelElement;
    readonly itemEnd: typeof MenuItemEndElement;
    readonly separator: typeof MenuSeparatorElement;
} = {
    root: MenuElement,
    trigger: MenuTriggerElement,
    backdrop: MenuBackdropElement,
    positioner: MenuPositionerElement,
    popup: MenuPopupElement,
    arrow: MenuArrowElement,
    item: MenuItemElement,
    linkItem: MenuLinkItemElement,
    submenu: MenuSubmenuElement,
    submenuTrigger: MenuSubmenuTriggerElement,
    checkboxItem: MenuCheckboxItemElement,
    radioGroup: MenuRadioGroupElement,
    radioItem: MenuRadioItemElement,
    itemIndicator: MenuItemIndicatorElement,
    group: MenuGroupElement,
    groupLabel: MenuGroupLabelElement,
    itemEnd: MenuItemEndElement,
    separator: MenuSeparatorElement
} as const;
export function define(options: DefineOptions) {
    registerElements('menu', elements, options);
}
export type MenuElement = InstanceType<typeof MenuElement>;
export type MenuTriggerElement = InstanceType<typeof MenuTriggerElement>;
export type MenuBackdropElement = InstanceType<typeof MenuBackdropElement>;
export type MenuPositionerElement = InstanceType<typeof MenuPositionerElement>;
export type MenuPopupElement = InstanceType<typeof MenuPopupElement>;
export type MenuArrowElement = InstanceType<typeof MenuArrowElement>;
export type MenuItemElement = InstanceType<typeof MenuItemElement>;
export type MenuLinkItemElement = InstanceType<typeof MenuLinkItemElement>;
export type MenuSubmenuElement = InstanceType<typeof MenuSubmenuElement>;
export type MenuSubmenuTriggerElement = InstanceType<typeof MenuSubmenuTriggerElement>;
export type MenuCheckboxItemElement = InstanceType<typeof MenuCheckboxItemElement>;
export type MenuRadioGroupElement = InstanceType<typeof MenuRadioGroupElement>;
export type MenuRadioItemElement = InstanceType<typeof MenuRadioItemElement>;
export type MenuItemIndicatorElement = InstanceType<typeof MenuItemIndicatorElement>;
export type MenuGroupElement = InstanceType<typeof MenuGroupElement>;
export type MenuGroupLabelElement = InstanceType<typeof MenuGroupLabelElement>;
export type MenuItemEndElement = InstanceType<typeof MenuItemEndElement>;
export type MenuSeparatorElement = InstanceType<typeof MenuSeparatorElement>;
