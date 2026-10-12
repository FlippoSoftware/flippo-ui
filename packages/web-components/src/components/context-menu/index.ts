import { registerElements } from '../../lib/registerElements';
import { define as defineMenu } from '../menu';

import type { DefineOptions } from '../../lib/registerElements';

import { ContextMenuElement } from './root/ContextMenuElement';
import { ContextMenuTriggerElement } from './trigger/ContextMenuTriggerElement';

export * from './root/ContextMenuElement';
export * from './trigger/ContextMenuTriggerElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: ContextMenuElement,
    trigger: ContextMenuTriggerElement
} as const;

/**
 * Registers the elements of the component (and the menu elements it uses) as `<prefix>-context-menu…` tags.
 */
export function define(options: DefineOptions) {
    defineMenu(options);
    registerElements('contextMenu', elements, options);
}
