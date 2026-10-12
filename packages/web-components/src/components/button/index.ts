import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { ButtonElement } from './root/ButtonElement';

export * from './root/ButtonElement';

/**
 * The element of the component.
 */
export const elements = ButtonElement;

/**
 * Registers the elements of the component as `<prefix>-button…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('button', elements, options);
}
