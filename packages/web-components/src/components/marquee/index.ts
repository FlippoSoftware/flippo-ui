import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { MarqueeElement } from './root/MarqueeElement';
import { MarqueeTrackElement } from './track/MarqueeTrackElement';

export * from './root/MarqueeElement';
export * from './root/MarqueeRootContext';
export * from './track/MarqueeTrackElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: MarqueeElement,
    track: MarqueeTrackElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-marquee…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('marquee', elements, options);
}
