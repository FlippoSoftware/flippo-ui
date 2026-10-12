import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { TabsIndicatorElement } from './indicator/TabsIndicatorElement';
import { TabsListElement } from './list/TabsListElement';
import { TabsPanelElement } from './panel/TabsPanelElement';
import { TabsElement } from './root/TabsElement';
import { TabsTabElement } from './tab/TabsTabElement';

export * from './indicator/TabsIndicatorElement';
export * from './list/TabsListElement';
export * from './panel/TabsPanelElement';
export * from './root/TabsElement';
export * from './root/TabsRootContext';
export * from './tab/TabsTabElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: TabsElement,
    list: TabsListElement,
    tab: TabsTabElement,
    indicator: TabsIndicatorElement,
    panel: TabsPanelElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-tabs…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('tabs', elements, options);
}
