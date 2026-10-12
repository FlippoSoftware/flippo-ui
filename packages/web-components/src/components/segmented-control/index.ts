import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { SegmentedControlItemElement } from './item/SegmentedControlItemElement';
import { SegmentedControlElement } from './root/SegmentedControlElement';

export * from './item/SegmentedControlItemElement';
export * from './root/SegmentedControlElement';
export * from './root/SegmentedControlRootContext';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: SegmentedControlElement,
    item: SegmentedControlItemElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-segmented-control…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('segmentedControl', elements, options);
}
