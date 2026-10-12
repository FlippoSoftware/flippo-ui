import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { CheckboxCardIndicatorElement } from './indicator/CheckboxCardIndicatorElement';
import { CheckboxCardElement } from './root/CheckboxCardElement';

export * from './indicator/CheckboxCardIndicatorElement';
export * from './root/CheckboxCardElement';
export * from './root/CheckboxCardRootContext';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: CheckboxCardElement,
    indicator: CheckboxCardIndicatorElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-checkbox-card…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('checkboxCard', elements, options);
}
