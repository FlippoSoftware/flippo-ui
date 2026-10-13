import { contextMenu as recipe } from '@flippo-software/component-styles/context-menu';
import { iconMarkup } from '@flippo-software/component-styles/icons';
import * as Primitive from '@flippo-software/web-components/context-menu';
import * as Dependency from '@flippo-software/web-components/menu';

import { define as defineDependency } from '~@components/menu';
import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const ContextMenuElement: StyledConstructor<typeof Primitive.elements.root, typeof recipe> = styled(
    Primitive.elements.root,
    recipe,
    'context-menu',
    'root',
    true
);
export type ContextMenuElement = InstanceType<typeof ContextMenuElement>;
export const ContextMenuTriggerElement: StyledConstructor<typeof Primitive.elements.trigger, typeof recipe> = styled(
    Primitive.elements.trigger,
    recipe,
    'context-menu',
    'trigger',
    false
);
export type ContextMenuTriggerElement = InstanceType<typeof ContextMenuTriggerElement>;
export const ContextMenuBackdropElement: StyledConstructor<typeof Dependency.elements.backdrop, typeof recipe> = styled(
    Dependency.elements.backdrop,
    recipe,
    'context-menu',
    'backdrop',
    false
);
export type ContextMenuBackdropElement = InstanceType<typeof ContextMenuBackdropElement>;
export const ContextMenuPositionerElement: StyledConstructor<typeof Dependency.elements.positioner, typeof recipe> = styled(
    Dependency.elements.positioner,
    recipe,
    'context-menu',
    'positioner',
    false,
    undefined,
    { defaults: { sideOffset: 8 } }
);
export type ContextMenuPositionerElement = InstanceType<typeof ContextMenuPositionerElement>;
export const ContextMenuPopupElement: StyledConstructor<typeof Dependency.elements.popup, typeof recipe> = styled(
    Dependency.elements.popup,
    recipe,
    'context-menu',
    'popup',
    false
);
export type ContextMenuPopupElement = InstanceType<typeof ContextMenuPopupElement>;
export const ContextMenuArrowElement: StyledConstructor<typeof Dependency.elements.arrow, typeof recipe> = styled(
    Dependency.elements.arrow,
    recipe,
    'context-menu',
    'arrow',
    false
);
export type ContextMenuArrowElement = InstanceType<typeof ContextMenuArrowElement>;
export const ContextMenuItemElement: StyledConstructor<typeof Dependency.elements.item, typeof recipe> = styled(
    Dependency.elements.item,
    recipe,
    'context-menu',
    'item',
    false
);
export type ContextMenuItemElement = InstanceType<typeof ContextMenuItemElement>;
export const ContextMenuLinkItemElement: StyledConstructor<typeof Dependency.elements.linkItem, typeof recipe> = styled(
    Dependency.elements.linkItem,
    recipe,
    'context-menu',
    'linkItem',
    false
);
export type ContextMenuLinkItemElement = InstanceType<typeof ContextMenuLinkItemElement>;
export const ContextMenuSubmenuElement: StyledConstructor<typeof Dependency.elements.submenu, typeof recipe> = styled(
    Dependency.elements.submenu,
    recipe,
    'context-menu',
    'submenu',
    false
);
export type ContextMenuSubmenuElement = InstanceType<typeof ContextMenuSubmenuElement>;
export const ContextMenuSubmenuTriggerElement: StyledConstructor<typeof Dependency.elements.submenuTrigger, typeof recipe> = styled(
    Dependency.elements.submenuTrigger,
    recipe,
    'context-menu',
    'submenuTrigger',
    false
);
export type ContextMenuSubmenuTriggerElement = InstanceType<typeof ContextMenuSubmenuTriggerElement>;
export const ContextMenuCheckboxItemElement: StyledConstructor<typeof Dependency.elements.checkboxItem, typeof recipe> = styled(
    Dependency.elements.checkboxItem,
    recipe,
    'context-menu',
    'checkboxItem',
    false
);
export type ContextMenuCheckboxItemElement = InstanceType<typeof ContextMenuCheckboxItemElement>;
export const ContextMenuRadioGroupElement: StyledConstructor<typeof Dependency.elements.radioGroup, typeof recipe> = styled(
    Dependency.elements.radioGroup,
    recipe,
    'context-menu',
    'radioGroup',
    false
);
export type ContextMenuRadioGroupElement = InstanceType<typeof ContextMenuRadioGroupElement>;
export const ContextMenuRadioItemElement: StyledConstructor<typeof Dependency.elements.radioItem, typeof recipe> = styled(
    Dependency.elements.radioItem,
    recipe,
    'context-menu',
    'radioItem',
    false
);
export type ContextMenuRadioItemElement = InstanceType<typeof ContextMenuRadioItemElement>;
export const ContextMenuItemIndicatorElement: StyledConstructor<typeof Dependency.elements.itemIndicator, typeof recipe> = styled(
    Dependency.elements.itemIndicator,
    recipe,
    'context-menu',
    'itemIndicator',
    false,
    undefined,
    { content: iconMarkup('check') }
);
export type ContextMenuItemIndicatorElement = InstanceType<typeof ContextMenuItemIndicatorElement>;
export const ContextMenuGroupElement: StyledConstructor<typeof Dependency.elements.group, typeof recipe> = styled(
    Dependency.elements.group,
    recipe,
    'context-menu',
    'group',
    false
);
export type ContextMenuGroupElement = InstanceType<typeof ContextMenuGroupElement>;
export const ContextMenuGroupLabelElement: StyledConstructor<typeof Dependency.elements.groupLabel, typeof recipe> = styled(
    Dependency.elements.groupLabel,
    recipe,
    'context-menu',
    'groupLabel',
    false
);
export type ContextMenuGroupLabelElement = InstanceType<typeof ContextMenuGroupLabelElement>;
export const ContextMenuItemEndElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'context-menu',
    'itemEnd',
    false
);
export type ContextMenuItemEndElement = InstanceType<typeof ContextMenuItemEndElement>;
export const ContextMenuSeparatorElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'context-menu',
    'separator',
    false
);
export type ContextMenuSeparatorElement = InstanceType<typeof ContextMenuSeparatorElement>;
export const elements: {
    readonly root: typeof ContextMenuElement;
    readonly trigger: typeof ContextMenuTriggerElement;
    readonly backdrop: typeof ContextMenuBackdropElement;
    readonly positioner: typeof ContextMenuPositionerElement;
    readonly popup: typeof ContextMenuPopupElement;
    readonly arrow: typeof ContextMenuArrowElement;
    readonly item: typeof ContextMenuItemElement;
    readonly linkItem: typeof ContextMenuLinkItemElement;
    readonly submenu: typeof ContextMenuSubmenuElement;
    readonly submenuTrigger: typeof ContextMenuSubmenuTriggerElement;
    readonly checkboxItem: typeof ContextMenuCheckboxItemElement;
    readonly radioGroup: typeof ContextMenuRadioGroupElement;
    readonly radioItem: typeof ContextMenuRadioItemElement;
    readonly itemIndicator: typeof ContextMenuItemIndicatorElement;
    readonly group: typeof ContextMenuGroupElement;
    readonly groupLabel: typeof ContextMenuGroupLabelElement;
    readonly itemEnd: typeof ContextMenuItemEndElement;
    readonly separator: typeof ContextMenuSeparatorElement;
} = {
    root: ContextMenuElement,
    trigger: ContextMenuTriggerElement,
    backdrop: ContextMenuBackdropElement,
    positioner: ContextMenuPositionerElement,
    popup: ContextMenuPopupElement,
    arrow: ContextMenuArrowElement,
    item: ContextMenuItemElement,
    linkItem: ContextMenuLinkItemElement,
    submenu: ContextMenuSubmenuElement,
    submenuTrigger: ContextMenuSubmenuTriggerElement,
    checkboxItem: ContextMenuCheckboxItemElement,
    radioGroup: ContextMenuRadioGroupElement,
    radioItem: ContextMenuRadioItemElement,
    itemIndicator: ContextMenuItemIndicatorElement,
    group: ContextMenuGroupElement,
    groupLabel: ContextMenuGroupLabelElement,
    itemEnd: ContextMenuItemEndElement,
    separator: ContextMenuSeparatorElement
};
export function define(options: DefineOptions) {
    defineDependency(options);
    registerElements('context-menu', elements, options);
}
