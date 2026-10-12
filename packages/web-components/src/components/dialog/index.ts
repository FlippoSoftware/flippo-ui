import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { DialogBackdropElement } from './backdrop/DialogBackdropElement';
import { DialogCloseElement } from './close/DialogCloseElement';
import { DialogDescriptionElement } from './description/DialogDescriptionElement';
import { DialogPopupElement } from './popup/DialogPopupElement';
import { DialogElement } from './root/DialogElement';
import { DialogTitleElement } from './title/DialogTitleElement';
import { DialogTriggerElement } from './trigger/DialogTriggerElement';

export * from './backdrop/DialogBackdropElement';
export * from './close/DialogCloseElement';
export * from './description/DialogDescriptionElement';
export * from './popup/DialogPopupElement';
export * from './root/DialogElement';
export * from './root/DialogRootContext';
export * from './title/DialogTitleElement';
export * from './trigger/DialogTriggerElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: DialogElement,
    trigger: DialogTriggerElement,
    backdrop: DialogBackdropElement,
    popup: DialogPopupElement,
    close: DialogCloseElement,
    title: DialogTitleElement,
    description: DialogDescriptionElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-dialog…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('dialog', elements, options);
}
