import { progress as recipe } from '@flippo-software/component-styles/progress';
import * as Primitive from '@flippo-software/web-components/progress';

import { registerElements } from '../../lib/register';
import { styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const ProgressElement: StyledConstructor<typeof Primitive.ProgressElement, typeof recipe> = styled(
    Primitive.ProgressElement,
    recipe,
    'progress',
    'root',
    true
);
export const ProgressLabelElement: StyledConstructor<typeof Primitive.ProgressLabelElement, typeof recipe> = styled(
    Primitive.ProgressLabelElement,
    recipe,
    'progress',
    'label',
    false
);
export const ProgressTrackElement: StyledConstructor<typeof Primitive.ProgressTrackElement, typeof recipe> = styled(
    Primitive.ProgressTrackElement,
    recipe,
    'progress',
    'track',
    false
);
export const ProgressIndicatorElement: StyledConstructor<typeof Primitive.ProgressIndicatorElement, typeof recipe> = styled(
    Primitive.ProgressIndicatorElement,
    recipe,
    'progress',
    'indicator',
    false
);
export const ProgressValueElement: StyledConstructor<typeof Primitive.ProgressValueElement, typeof recipe> = styled(
    Primitive.ProgressValueElement,
    recipe,
    'progress',
    'value',
    false
);
export const elements: {
    readonly root: typeof ProgressElement;
    readonly label: typeof ProgressLabelElement;
    readonly track: typeof ProgressTrackElement;
    readonly indicator: typeof ProgressIndicatorElement;
    readonly value: typeof ProgressValueElement;
} = {
    root: ProgressElement,
    label: ProgressLabelElement,
    track: ProgressTrackElement,
    indicator: ProgressIndicatorElement,
    value: ProgressValueElement
} as const;
export function define(options: DefineOptions) {
    registerElements('progress', elements, options);
}
export type ProgressElement = InstanceType<typeof ProgressElement>;
export type ProgressLabelElement = InstanceType<typeof ProgressLabelElement>;
export type ProgressTrackElement = InstanceType<typeof ProgressTrackElement>;
export type ProgressIndicatorElement = InstanceType<typeof ProgressIndicatorElement>;
export type ProgressValueElement = InstanceType<typeof ProgressValueElement>;
