import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { ScrollAreaContentElement } from './content/ScrollAreaContentElement';
import { ScrollAreaCornerElement } from './corner/ScrollAreaCornerElement';
import { ScrollAreaElement } from './root/ScrollAreaElement';
import { ScrollAreaScrollbarElement } from './scrollbar/ScrollAreaScrollbarElement';
import { ScrollAreaThumbElement } from './thumb/ScrollAreaThumbElement';
import { ScrollAreaViewportElement } from './viewport/ScrollAreaViewportElement';

export * from './content/ScrollAreaContentElement';
export * from './corner/ScrollAreaCornerElement';
export * from './root/ScrollAreaElement';
export * from './root/ScrollAreaRootContext';
export * from './scrollbar/ScrollAreaScrollbarElement';
export * from './thumb/ScrollAreaThumbElement';
export * from './viewport/ScrollAreaViewportElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: ScrollAreaElement,
    viewport: ScrollAreaViewportElement,
    content: ScrollAreaContentElement,
    scrollbar: ScrollAreaScrollbarElement,
    thumb: ScrollAreaThumbElement,
    corner: ScrollAreaCornerElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-scroll-area…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('scrollArea', elements, options);
}
