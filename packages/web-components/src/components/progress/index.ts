import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { ProgressIndicatorElement } from './indicator/ProgressIndicatorElement';
import { ProgressLabelElement } from './label/ProgressLabelElement';
import { ProgressElement } from './root/ProgressElement';
import { ProgressTrackElement } from './track/ProgressTrackElement';
import { ProgressValueElement } from './value/ProgressValueElement';

export * from './indicator/ProgressIndicatorElement';
export * from './label/ProgressLabelElement';
export * from './root/ProgressElement';
export * from './root/ProgressRootContext';
export * from './track/ProgressTrackElement';
export * from './value/ProgressValueElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: ProgressElement,
    label: ProgressLabelElement,
    track: ProgressTrackElement,
    indicator: ProgressIndicatorElement,
    value: ProgressValueElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-progress…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('progress', elements, options);
}
