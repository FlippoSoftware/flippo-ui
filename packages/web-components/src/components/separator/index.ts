import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { SeparatorElement } from './root/SeparatorElement';

export * from './root/SeparatorElement';

/**
 * The element of the component.
 */
export const elements = SeparatorElement;

/**
 * Registers the elements of the component as `<prefix>-separator…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('separator', elements, options);
}
