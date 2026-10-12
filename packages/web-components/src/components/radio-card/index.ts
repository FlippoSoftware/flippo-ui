import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { RadioCardIndicatorElement } from './indicator/RadioCardIndicatorElement';
import { RadioCardElement } from './root/RadioCardElement';

export * from './indicator/RadioCardIndicatorElement';
export * from './root/RadioCardElement';
export * from './root/RadioCardRootContext';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: RadioCardElement,
    indicator: RadioCardIndicatorElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-radio-card…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('radioCard', elements, options);
}
