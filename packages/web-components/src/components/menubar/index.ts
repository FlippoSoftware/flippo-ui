import { registerElements } from '../../lib/registerElements';
import { define as defineMenu } from '../menu';

import type { DefineOptions } from '../../lib/registerElements';

import { MenubarElement } from './root/MenubarElement';

export * from './root/MenubarElement';
export * from './root/MenubarRootContext';

/**
 * The element of the component.
 */
export const elements = MenubarElement;

/**
 * Registers the elements of the component (and the menu elements it uses) as `<prefix>-menubar…` tags.
 */
export function define(options: DefineOptions) {
    defineMenu(options);
    registerElements('menubar', elements, options);
}
