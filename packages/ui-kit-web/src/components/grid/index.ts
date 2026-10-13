import { grid as recipe } from '@flippo-software/component-styles/grid';

import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const GridElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'grid'> = styled(
    PresentationElement,
    recipe,
    'grid',
    'root',
    true,
    'grid'
);
export const GridItemElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'box'> = styled(
    PresentationElement,
    recipe,
    'grid',
    'item',
    false,
    'box'
);
export const elements: { readonly root: typeof GridElement; readonly item: typeof GridItemElement } = {
    root: GridElement,
    item: GridItemElement
} as const;
export function define(options: DefineOptions) {
    registerElements('grid', elements, options);
}
export type GridElement = InstanceType<typeof GridElement>;
export type GridItemElement = InstanceType<typeof GridItemElement>;
