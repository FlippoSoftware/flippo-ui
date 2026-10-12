import { list as recipe } from '@flippo-software/component-styles/list';

import { registerElements } from '../../lib/register';
import { PresentationElement, styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const ListElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'list',
    'root',
    true
);
export const ListItemElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'list',
    'item',
    false
);
export const ListMarkerElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'list',
    'marker',
    false
);
export const ListSubheaderElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'list',
    'subheader',
    false
);
export const elements: {
    readonly root: typeof ListElement;
    readonly item: typeof ListItemElement;
    readonly marker: typeof ListMarkerElement;
    readonly subheader: typeof ListSubheaderElement;
} = { root: ListElement, item: ListItemElement, marker: ListMarkerElement, subheader: ListSubheaderElement } as const;
export function define(options: DefineOptions) {
    registerElements('list', elements, options);
}
export type ListElement = InstanceType<typeof ListElement>;
export type ListItemElement = InstanceType<typeof ListItemElement>;
export type ListMarkerElement = InstanceType<typeof ListMarkerElement>;
export type ListSubheaderElement = InstanceType<typeof ListSubheaderElement>;
