import { segmentedControl as recipe } from '@flippo-software/component-styles/segmented-control';
import * as Primitive from '@flippo-software/web-components/segmented-control';

import { registerElements } from '~@lib/register';
import { styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const SegmentedControlElement: StyledConstructor<typeof Primitive.SegmentedControlElement, typeof recipe> = styled(
    Primitive.SegmentedControlElement,
    recipe,
    'segmented-control',
    'root',
    true
);
export const SegmentedControlItemElement: StyledConstructor<typeof Primitive.SegmentedControlItemElement, typeof recipe> = styled(
    Primitive.SegmentedControlItemElement,
    recipe,
    'segmented-control',
    'item',
    false
);
export const elements: { readonly root: typeof SegmentedControlElement; readonly item: typeof SegmentedControlItemElement } = {
    root: SegmentedControlElement,
    item: SegmentedControlItemElement
} as const;
export function define(options: DefineOptions) {
    registerElements('segmented-control', elements, options);
}
export type SegmentedControlElement = InstanceType<typeof SegmentedControlElement>;
export type SegmentedControlItemElement = InstanceType<typeof SegmentedControlItemElement>;
