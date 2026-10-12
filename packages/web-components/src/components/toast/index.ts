import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { ToastActionElement } from './action/ToastActionElement';
import { ToastCloseElement } from './close/ToastCloseElement';
import { ToastDescriptionElement } from './description/ToastDescriptionElement';
import { ToastProviderElement } from './provider/ToastProviderElement';
import { ToastElement } from './root/ToastElement';
import { ToastTitleElement } from './title/ToastTitleElement';
import { ToastViewportElement } from './viewport/ToastViewportElement';

export * from './action/ToastActionElement';
export * from './close/ToastCloseElement';
export * from './description/ToastDescriptionElement';
export * from './provider/ToastProviderElement';
export * from './root/ToastElement';
export * from './root/ToastRootContext';
export * from './title/ToastTitleElement';
export * from './viewport/ToastViewportElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    provider: ToastProviderElement,
    viewport: ToastViewportElement,
    root: ToastElement,
    title: ToastTitleElement,
    description: ToastDescriptionElement,
    action: ToastActionElement,
    close: ToastCloseElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-toast…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('toast', elements, options);
}
