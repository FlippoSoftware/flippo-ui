import { meter as recipe } from '@flippo-software/component-styles/meter';
import * as Primitive from '@flippo-software/web-components/meter';

import { registerElements } from '~@lib/register';
import { styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const MeterElement: StyledConstructor<typeof Primitive.MeterElement, typeof recipe> = styled(
    Primitive.MeterElement,
    recipe,
    'meter',
    'root',
    true
);
export const MeterLabelElement: StyledConstructor<typeof Primitive.MeterLabelElement, typeof recipe> = styled(
    Primitive.MeterLabelElement,
    recipe,
    'meter',
    'label',
    false
);
export const MeterTrackElement: StyledConstructor<typeof Primitive.MeterTrackElement, typeof recipe> = styled(
    Primitive.MeterTrackElement,
    recipe,
    'meter',
    'track',
    false
);
export const MeterIndicatorElement: StyledConstructor<typeof Primitive.MeterIndicatorElement, typeof recipe> = styled(
    Primitive.MeterIndicatorElement,
    recipe,
    'meter',
    'indicator',
    false
);
export const MeterValueElement: StyledConstructor<typeof Primitive.MeterValueElement, typeof recipe> = styled(
    Primitive.MeterValueElement,
    recipe,
    'meter',
    'value',
    false
);
export const elements: {
    readonly root: typeof MeterElement;
    readonly label: typeof MeterLabelElement;
    readonly track: typeof MeterTrackElement;
    readonly indicator: typeof MeterIndicatorElement;
    readonly value: typeof MeterValueElement;
} = {
    root: MeterElement,
    label: MeterLabelElement,
    track: MeterTrackElement,
    indicator: MeterIndicatorElement,
    value: MeterValueElement
} as const;
export function define(options: DefineOptions) {
    registerElements('meter', elements, options);
}
export type MeterElement = InstanceType<typeof MeterElement>;
export type MeterLabelElement = InstanceType<typeof MeterLabelElement>;
export type MeterTrackElement = InstanceType<typeof MeterTrackElement>;
export type MeterIndicatorElement = InstanceType<typeof MeterIndicatorElement>;
export type MeterValueElement = InstanceType<typeof MeterValueElement>;
