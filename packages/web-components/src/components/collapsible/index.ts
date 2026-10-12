import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { CollapsiblePanelElement } from './panel/CollapsiblePanelElement';
import { CollapsibleElement } from './root/CollapsibleElement';
import { CollapsibleTriggerElement } from './trigger/CollapsibleTriggerElement';

export * from './panel/CollapsiblePanelElement';
export * from './root/CollapsibleElement';
export * from './root/CollapsibleRootContext';
export * from './trigger/CollapsibleTriggerElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: CollapsibleElement,
    trigger: CollapsibleTriggerElement,
    panel: CollapsiblePanelElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-collapsible…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('collapsible', elements, options);
}
