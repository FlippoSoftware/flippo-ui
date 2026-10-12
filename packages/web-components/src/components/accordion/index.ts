import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { AccordionHeaderElement } from './header/AccordionHeaderElement';
import { AccordionItemElement } from './item/AccordionItemElement';
import { AccordionPanelElement } from './panel/AccordionPanelElement';
import { AccordionElement } from './root/AccordionElement';
import { AccordionTriggerElement } from './trigger/AccordionTriggerElement';

export * from './header/AccordionHeaderElement';
export * from './item/AccordionItemElement';
export * from './panel/AccordionPanelElement';
export * from './root/AccordionElement';
export * from './root/AccordionRootContext';
export * from './trigger/AccordionTriggerElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: AccordionElement,
    item: AccordionItemElement,
    header: AccordionHeaderElement,
    trigger: AccordionTriggerElement,
    panel: AccordionPanelElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-accordion…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('accordion', elements, options);
}
