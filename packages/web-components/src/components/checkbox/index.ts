import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { CheckboxIndicatorElement } from './indicator/CheckboxIndicatorElement';
import { CheckboxElement } from './root/CheckboxElement';

export * from '../checkbox-group/root/CheckboxGroupElement';

export * from './indicator/CheckboxIndicatorElement';
export * from './root/CheckboxElement';
export * from './root/CheckboxRootContext';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: CheckboxElement,
    indicator: CheckboxIndicatorElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-checkbox…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('checkbox', elements, options);
}
