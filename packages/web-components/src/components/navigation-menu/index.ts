import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { NavigationMenuContentElement } from './content/NavigationMenuContentElement';
import { NavigationMenuIconElement } from './icon/NavigationMenuIconElement';
import { NavigationMenuItemElement } from './item/NavigationMenuItemElement';
import { NavigationMenuLinkElement } from './link/NavigationMenuLinkElement';
import { NavigationMenuListElement } from './list/NavigationMenuListElement';
import { NavigationMenuElement } from './root/NavigationMenuElement';
import { NavigationMenuTriggerElement } from './trigger/NavigationMenuTriggerElement';

export * from './content/NavigationMenuContentElement';
export * from './icon/NavigationMenuIconElement';
export * from './item/NavigationMenuItemElement';
export * from './link/NavigationMenuLinkElement';
export * from './list/NavigationMenuListElement';
export * from './root/NavigationMenuElement';
export * from './root/NavigationMenuRootContext';
export * from './trigger/NavigationMenuTriggerElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: NavigationMenuElement,
    list: NavigationMenuListElement,
    item: NavigationMenuItemElement,
    trigger: NavigationMenuTriggerElement,
    icon: NavigationMenuIconElement,
    content: NavigationMenuContentElement,
    link: NavigationMenuLinkElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-navigation-menu…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('navigationMenu', elements, options);
}
