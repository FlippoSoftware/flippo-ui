import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { SliderControlElement } from './control/SliderControlElement';
import { SliderIndicatorElement } from './indicator/SliderIndicatorElement';
import { SliderElement } from './root/SliderElement';
import { SliderThumbElement } from './thumb/SliderThumbElement';
import { SliderTrackElement } from './track/SliderTrackElement';
import { SliderValueElement } from './value/SliderValueElement';

export * from './control/SliderControlElement';
export * from './indicator/SliderIndicatorElement';
export * from './root/SliderElement';
export * from './root/SliderRootContext';
export * from './thumb/SliderThumbElement';
export * from './track/SliderTrackElement';
export * from './value/SliderValueElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: SliderElement,
    value: SliderValueElement,
    control: SliderControlElement,
    track: SliderTrackElement,
    indicator: SliderIndicatorElement,
    thumb: SliderThumbElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-slider…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('slider', elements, options);
}
