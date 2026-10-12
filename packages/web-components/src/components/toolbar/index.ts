import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { ToolbarButtonElement } from './button/ToolbarButtonElement';
import { ToolbarGroupElement } from './group/ToolbarGroupElement';
import { ToolbarInputElement } from './input/ToolbarInputElement';
import { ToolbarLinkElement } from './link/ToolbarLinkElement';
import { ToolbarElement } from './root/ToolbarElement';
import { ToolbarSeparatorElement } from './separator/ToolbarSeparatorElement';

export * from './button/ToolbarButtonElement';
export * from './group/ToolbarGroupElement';
export * from './input/ToolbarInputElement';
export * from './link/ToolbarLinkElement';
export * from './root/ToolbarElement';
export * from './root/ToolbarRootContext';
export * from './separator/ToolbarSeparatorElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: ToolbarElement,
    group: ToolbarGroupElement,
    button: ToolbarButtonElement,
    link: ToolbarLinkElement,
    input: ToolbarInputElement,
    separator: ToolbarSeparatorElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-toolbar…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('toolbar', elements, options);
}
