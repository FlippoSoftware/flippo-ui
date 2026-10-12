import { registerElements } from '../../lib/registerElements';
import { DialogCloseElement } from '../dialog/close/DialogCloseElement';
import { DialogDescriptionElement } from '../dialog/description/DialogDescriptionElement';
import { DialogTitleElement } from '../dialog/title/DialogTitleElement';
import { DialogTriggerElement } from '../dialog/trigger/DialogTriggerElement';

import type { DefineOptions } from '../../lib/registerElements';

import { DrawerBackdropElement } from './backdrop/DrawerBackdropElement';
import { DrawerDragElement } from './drag/DrawerDragElement';
import { DrawerPopupElement } from './popup/DrawerPopupElement';
import { DrawerElement } from './root/DrawerElement';

export * from './backdrop/DrawerBackdropElement';
export * from './drag/DrawerDragElement';
export * from './popup/DrawerPopupElement';
export * from './root/DrawerElement';
export * from './root/DrawerRootContext';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: DrawerElement,
    trigger: DialogTriggerElement,
    backdrop: DrawerBackdropElement,
    popup: DrawerPopupElement,
    drag: DrawerDragElement,
    close: DialogCloseElement,
    title: DialogTitleElement,
    description: DialogDescriptionElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-drawer…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('drawer', elements, options);
}
