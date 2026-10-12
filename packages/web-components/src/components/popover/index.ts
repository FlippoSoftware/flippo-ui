import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { PopoverArrowElement } from './arrow/PopoverArrowElement';
import { PopoverCloseElement } from './close/PopoverCloseElement';
import { PopoverDescriptionElement } from './description/PopoverDescriptionElement';
import { PopoverPopupElement } from './popup/PopoverPopupElement';
import { PopoverPositionerElement } from './positioner/PopoverPositionerElement';
import { PopoverElement } from './root/PopoverElement';
import { PopoverTitleElement } from './title/PopoverTitleElement';
import { PopoverTriggerElement } from './trigger/PopoverTriggerElement';

export * from './arrow/PopoverArrowElement';
export * from './close/PopoverCloseElement';
export * from './description/PopoverDescriptionElement';
export * from './popup/PopoverPopupElement';
export * from './positioner/PopoverPositionerElement';
export * from './root/PopoverElement';
export * from './root/PopoverRootContext';
export * from './title/PopoverTitleElement';
export * from './trigger/PopoverTriggerElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: PopoverElement,
    trigger: PopoverTriggerElement,
    positioner: PopoverPositionerElement,
    popup: PopoverPopupElement,
    arrow: PopoverArrowElement,
    close: PopoverCloseElement,
    title: PopoverTitleElement,
    description: PopoverDescriptionElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-popover…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('popover', elements, options);
}
