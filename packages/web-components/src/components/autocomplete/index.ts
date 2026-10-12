import { registerElements } from '../../lib/registerElements';
import { define as defineCombobox } from '../combobox';

import type { DefineOptions } from '../../lib/registerElements';

import { AutocompleteElement } from './root/AutocompleteElement';

export * from './root/AutocompleteElement';
export * from './root/AutocompleteRootContext';

/**
 * The element of the component.
 */
export const elements = AutocompleteElement;

/**
 * Registers the elements of the component (and the combobox elements it uses) as `<prefix>-autocomplete…` tags.
 */
export function define(options: DefineOptions) {
    defineCombobox(options);
    registerElements('autocomplete', elements, options);
}
