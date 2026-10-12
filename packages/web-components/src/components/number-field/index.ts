import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { NumberFieldDecrementElement } from './decrement/NumberFieldDecrementElement';
import { NumberFieldGroupElement } from './group/NumberFieldGroupElement';
import { NumberFieldIncrementElement } from './increment/NumberFieldIncrementElement';
import { NumberFieldInputElement } from './input/NumberFieldInputElement';
import { NumberFieldElement } from './root/NumberFieldElement';
import { NumberFieldScrubAreaElement } from './scrub-area/NumberFieldScrubAreaElement';
import { NumberFieldScrubAreaCursorElement } from './scrub-area-cursor/NumberFieldScrubAreaCursorElement';

export * from './decrement/NumberFieldDecrementElement';
export * from './group/NumberFieldGroupElement';
export * from './increment/NumberFieldIncrementElement';
export * from './input/NumberFieldInputElement';
export * from './root/NumberFieldElement';
export * from './root/NumberFieldRootContext';
export * from './scrub-area/NumberFieldScrubAreaElement';
export * from './scrub-area-cursor/NumberFieldScrubAreaCursorElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: NumberFieldElement,
    group: NumberFieldGroupElement,
    input: NumberFieldInputElement,
    increment: NumberFieldIncrementElement,
    decrement: NumberFieldDecrementElement,
    scrubArea: NumberFieldScrubAreaElement,
    scrubAreaCursor: NumberFieldScrubAreaCursorElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-number-field…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('numberField', elements, options);
}
