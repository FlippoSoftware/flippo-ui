export * from './root/CheckboxGroupElement';
export { CheckboxGroupElement } from './root/CheckboxGroupElement';

import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { CheckboxGroupElement } from './root/CheckboxGroupElement';

/**
 * The element of the component.
 */
export const elements = CheckboxGroupElement;

/**
 * Registers the elements of the component as `<prefix>-checkbox-group…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('checkboxGroup', elements, options);
}
