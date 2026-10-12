import { skeleton as recipe } from '@flippo-software/component-styles/skeleton';

import { registerElements } from '../../lib/register';
import { PresentationElement, styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const SkeletonElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'skeleton'> = styled(
    PresentationElement,
    recipe,
    'skeleton',
    'root',
    true,
    'skeleton'
);
export const elements: typeof SkeletonElement = SkeletonElement;
export function define(options: DefineOptions) {
    registerElements('skeleton', elements, options);
}
export type SkeletonElement = InstanceType<typeof SkeletonElement>;
