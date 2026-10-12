import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { ToggleGroupElement } from './root/ToggleGroupElement';

export * from './root/ToggleGroupElement';
export * from './root/ToggleGroupRootContext';

/**
 * The element of the component.
 */
export const elements = ToggleGroupElement;

/**
 * Registers the elements of the component as `<prefix>-toggle-group…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('toggleGroup', elements, options);
}
