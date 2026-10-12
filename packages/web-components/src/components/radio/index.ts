import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { RadioIndicatorElement } from './indicator/RadioIndicatorElement';
import { RadioElement } from './root/RadioElement';

export * from '../radio-group/root/RadioGroupElement';

export * from './indicator/RadioIndicatorElement';
export * from './root/RadioElement';
export * from './root/RadioRootContext';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: RadioElement,
    indicator: RadioIndicatorElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-radio…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('radio', elements, options);
}
