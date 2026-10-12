import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { FieldsetLegendElement } from './legend/FieldsetLegendElement';
import { FieldsetElement } from './root/FieldsetElement';

export * from './legend/FieldsetLegendElement';
export * from './root/FieldsetElement';
export * from './root/FieldsetRootContext';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: FieldsetElement,
    legend: FieldsetLegendElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-fieldset…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('fieldset', elements, options);
}
