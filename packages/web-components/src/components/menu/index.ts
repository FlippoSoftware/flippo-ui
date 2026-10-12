import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { MenuArrowElement } from './arrow/MenuArrowElement';
import { MenuBackdropElement } from './backdrop/MenuBackdropElement';
import { MenuCheckboxItemElement } from './checkbox-item/MenuCheckboxItemElement';
import { MenuGroupElement } from './group/MenuGroupElement';
import { MenuGroupLabelElement } from './group-label/MenuGroupLabelElement';
import { MenuItemElement } from './item/MenuItemElement';
import { MenuItemIndicatorElement } from './item-indicator/MenuItemIndicatorElement';
import { MenuLinkItemElement } from './link-item/MenuLinkItemElement';
import { MenuPopupElement } from './popup/MenuPopupElement';
import { MenuPositionerElement } from './positioner/MenuPositionerElement';
import { MenuRadioGroupElement } from './radio-group/MenuRadioGroupElement';
import { MenuRadioItemElement } from './radio-item/MenuRadioItemElement';
import { MenuElement } from './root/MenuElement';
import { MenuSubmenuElement } from './submenu/MenuSubmenuElement';
import { MenuSubmenuTriggerElement } from './submenu-trigger/MenuSubmenuTriggerElement';
import { MenuTriggerElement } from './trigger/MenuTriggerElement';

export * from './arrow/MenuArrowElement';
export * from './backdrop/MenuBackdropElement';
export * from './checkbox-item/MenuCheckboxItemElement';
export * from './group/MenuGroupElement';
export * from './group-label/MenuGroupLabelElement';
export * from './item/MenuItemElement';
export * from './item-indicator/MenuItemIndicatorElement';
export * from './link-item/MenuLinkItemElement';
export * from './popup/MenuPopupElement';
export * from './positioner/MenuPositionerElement';
export * from './radio-group/MenuRadioGroupElement';
export * from './radio-item/MenuRadioItemElement';
export * from './root/MenuElement';
export * from './root/MenuRootContext';
export * from './submenu/MenuSubmenuElement';
export * from './submenu-trigger/MenuSubmenuTriggerElement';
export * from './trigger/MenuTriggerElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
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
    groupLabel: MenuGroupLabelElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-menu…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('menu', elements, options);
}
