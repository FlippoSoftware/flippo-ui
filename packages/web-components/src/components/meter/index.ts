import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { MeterIndicatorElement } from './indicator/MeterIndicatorElement';
import { MeterLabelElement } from './label/MeterLabelElement';
import { MeterElement } from './root/MeterElement';
import { MeterTrackElement } from './track/MeterTrackElement';
import { MeterValueElement } from './value/MeterValueElement';

export * from './indicator/MeterIndicatorElement';
export * from './label/MeterLabelElement';
export * from './root/MeterElement';
export * from './root/MeterRootContext';
export * from './track/MeterTrackElement';
export * from './value/MeterValueElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: MeterElement,
    label: MeterLabelElement,
    track: MeterTrackElement,
    indicator: MeterIndicatorElement,
    value: MeterValueElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-meter…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('meter', elements, options);
}
