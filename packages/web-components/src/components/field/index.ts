import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { FieldControlElement } from './control/FieldControlElement';
import { FieldDescriptionElement } from './description/FieldDescriptionElement';
import { FieldErrorElement } from './error/FieldErrorElement';
import { FieldItemElement } from './item/FieldItemElement';
import { FieldLabelElement } from './label/FieldLabelElement';
import { FieldElement } from './root/FieldElement';

export * from './control/FieldControlElement';
export * from './description/FieldDescriptionElement';
export * from './error/FieldErrorElement';
export * from './item/FieldItemElement';
export * from './label/FieldLabelElement';
export * from './root/FieldElement';
export * from './root/FieldRootContext';
export * from './utils/ControlElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: FieldElement,
    item: FieldItemElement,
    label: FieldLabelElement,
    control: FieldControlElement,
    description: FieldDescriptionElement,
    error: FieldErrorElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-field…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('field', elements, options);
}
