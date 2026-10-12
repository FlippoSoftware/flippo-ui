import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { ToggleElement } from './root/ToggleElement';

export * from './root/ToggleElement';
export * from './root/ToggleRootContext';

/**
 * The element of the component.
 */
export const elements = ToggleElement;

/**
 * Registers the elements of the component as `<prefix>-toggle…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('toggle', elements, options);
}
