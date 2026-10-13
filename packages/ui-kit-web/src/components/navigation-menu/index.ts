import { iconMarkup } from '@flippo-software/component-styles/icons';
import { navigationMenu as recipe } from '@flippo-software/component-styles/navigation-menu';
import * as Primitive from '@flippo-software/web-components/navigation-menu';

import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const NavigationMenuElement: StyledConstructor<typeof Primitive.NavigationMenuElement, typeof recipe> = styled(
    Primitive.NavigationMenuElement,
    recipe,
    'navigation-menu',
    'root',
    true
);
export const NavigationMenuListElement: StyledConstructor<typeof Primitive.NavigationMenuListElement, typeof recipe> = styled(
    Primitive.NavigationMenuListElement,
    recipe,
    'navigation-menu',
    'list',
    false
);
export const NavigationMenuItemElement: StyledConstructor<typeof Primitive.NavigationMenuItemElement, typeof recipe> = styled(
    Primitive.NavigationMenuItemElement,
    recipe,
    'navigation-menu',
    'item',
    false
);
export const NavigationMenuTriggerElement: StyledConstructor<typeof Primitive.NavigationMenuTriggerElement, typeof recipe> = styled(
    Primitive.NavigationMenuTriggerElement,
    recipe,
    'navigation-menu',
    'trigger',
    false
);
export const NavigationMenuIconElement: StyledConstructor<typeof Primitive.NavigationMenuIconElement, typeof recipe> = styled(
    Primitive.NavigationMenuIconElement,
    recipe,
    'navigation-menu',
    'icon',
    false,
    undefined,
    { content: iconMarkup('chevron-down') }
);
export const NavigationMenuContentElement: StyledConstructor<typeof Primitive.NavigationMenuContentElement, typeof recipe> = styled(
    Primitive.NavigationMenuContentElement,
    recipe,
    'navigation-menu',
    'content',
    false
);
export const NavigationMenuLinkElement: StyledConstructor<typeof Primitive.NavigationMenuLinkElement, typeof recipe> = styled(
    Primitive.NavigationMenuLinkElement,
    recipe,
    'navigation-menu',
    'link',
    false
);
export const NavigationMenuPositionerElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'navigation-menu',
    'positioner'
);
export const NavigationMenuPopupElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'navigation-menu',
    'popup'
);
export const NavigationMenuViewportElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'navigation-menu',
    'viewport'
);
export const NavigationMenuLinkDescriptionElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'navigation-menu',
    'linkDescription'
);
export const NavigationMenuArrowElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'navigation-menu',
    'arrow'
);
export const NavigationMenuBackdropElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'navigation-menu',
    'backdrop'
);
export const elements: {
    readonly root: typeof NavigationMenuElement;
    readonly list: typeof NavigationMenuListElement;
    readonly item: typeof NavigationMenuItemElement;
    readonly trigger: typeof NavigationMenuTriggerElement;
    readonly icon: typeof NavigationMenuIconElement;
    readonly content: typeof NavigationMenuContentElement;
    readonly link: typeof NavigationMenuLinkElement;
    readonly positioner: typeof NavigationMenuPositionerElement;
    readonly popup: typeof NavigationMenuPopupElement;
    readonly viewport: typeof NavigationMenuViewportElement;
    readonly linkDescription: typeof NavigationMenuLinkDescriptionElement;
    readonly arrow: typeof NavigationMenuArrowElement;
    readonly backdrop: typeof NavigationMenuBackdropElement;
} = {
    root: NavigationMenuElement,
    list: NavigationMenuListElement,
    item: NavigationMenuItemElement,
    trigger: NavigationMenuTriggerElement,
    icon: NavigationMenuIconElement,
    content: NavigationMenuContentElement,
    link: NavigationMenuLinkElement,
    positioner: NavigationMenuPositionerElement,
    popup: NavigationMenuPopupElement,
    viewport: NavigationMenuViewportElement,
    linkDescription: NavigationMenuLinkDescriptionElement,
    arrow: NavigationMenuArrowElement,
    backdrop: NavigationMenuBackdropElement
} as const;
export function define(options: DefineOptions) {
    registerElements('navigation-menu', elements, options);
}
export type NavigationMenuElement = InstanceType<typeof NavigationMenuElement>;
export type NavigationMenuListElement = InstanceType<typeof NavigationMenuListElement>;
export type NavigationMenuItemElement = InstanceType<typeof NavigationMenuItemElement>;
export type NavigationMenuTriggerElement = InstanceType<typeof NavigationMenuTriggerElement>;
export type NavigationMenuIconElement = InstanceType<typeof NavigationMenuIconElement>;
export type NavigationMenuContentElement = InstanceType<typeof NavigationMenuContentElement>;
export type NavigationMenuLinkElement = InstanceType<typeof NavigationMenuLinkElement>;
export type NavigationMenuPositionerElement = InstanceType<typeof NavigationMenuPositionerElement>;
export type NavigationMenuPopupElement = InstanceType<typeof NavigationMenuPopupElement>;
export type NavigationMenuViewportElement = InstanceType<typeof NavigationMenuViewportElement>;
export type NavigationMenuLinkDescriptionElement = InstanceType<typeof NavigationMenuLinkDescriptionElement>;
export type NavigationMenuArrowElement = InstanceType<typeof NavigationMenuArrowElement>;
export type NavigationMenuBackdropElement = InstanceType<typeof NavigationMenuBackdropElement>;
