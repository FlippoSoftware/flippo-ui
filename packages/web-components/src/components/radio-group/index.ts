export * from './root/RadioGroupElement';
export { RadioGroupElement } from './root/RadioGroupElement';

import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { RadioGroupElement } from './root/RadioGroupElement';

/**
 * The element of the component.
 */
export const elements = RadioGroupElement;

/**
 * Registers the elements of the component as `<prefix>-radio-group…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('radioGroup', elements, options);
}
