import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { SwitchElement } from './root/SwitchElement';
import { SwitchThumbElement } from './thumb/SwitchThumbElement';

export * from './root/SwitchElement';
export * from './root/SwitchRootContext';
export * from './thumb/SwitchThumbElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: SwitchElement,
    thumb: SwitchThumbElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-switch…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('switch', elements, options);
}
