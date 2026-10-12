import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { FormElement } from './root/FormElement';

export * from './root/FormElement';
export * from './root/FormRootContext';

/**
 * The element of the component.
 */
export const elements = FormElement;

/**
 * Registers the elements of the component as `<prefix>-form…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('form', elements, options);
}
