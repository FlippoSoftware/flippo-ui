import { scrollArea as recipe } from '@flippo-software/component-styles/scroll-area';
import * as Primitive from '@flippo-software/web-components/scroll-area';

import { registerElements } from '../../lib/register';
import { styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const ScrollAreaElement: StyledConstructor<typeof Primitive.ScrollAreaElement, typeof recipe> = styled(
    Primitive.ScrollAreaElement,
    recipe,
    'scroll-area',
    'root',
    true
);
export const ScrollAreaViewportElement: StyledConstructor<typeof Primitive.ScrollAreaViewportElement, typeof recipe> = styled(
    Primitive.ScrollAreaViewportElement,
    recipe,
    'scroll-area',
    'viewport',
    false
);
export const ScrollAreaContentElement: StyledConstructor<typeof Primitive.ScrollAreaContentElement, typeof recipe> = styled(
    Primitive.ScrollAreaContentElement,
    recipe,
    'scroll-area',
    'content',
    false
);
export const ScrollAreaScrollbarElement: StyledConstructor<typeof Primitive.ScrollAreaScrollbarElement, typeof recipe> = styled(
    Primitive.ScrollAreaScrollbarElement,
    recipe,
    'scroll-area',
    'scrollbar',
    false
);
export const ScrollAreaThumbElement: StyledConstructor<typeof Primitive.ScrollAreaThumbElement, typeof recipe> = styled(
    Primitive.ScrollAreaThumbElement,
    recipe,
    'scroll-area',
    'thumb',
    false
);
export const ScrollAreaCornerElement: StyledConstructor<typeof Primitive.ScrollAreaCornerElement, typeof recipe> = styled(
    Primitive.ScrollAreaCornerElement,
    recipe,
    'scroll-area',
    'corner',
    false
);
export const elements: {
    readonly root: typeof ScrollAreaElement;
    readonly viewport: typeof ScrollAreaViewportElement;
    readonly content: typeof ScrollAreaContentElement;
    readonly scrollbar: typeof ScrollAreaScrollbarElement;
    readonly thumb: typeof ScrollAreaThumbElement;
    readonly corner: typeof ScrollAreaCornerElement;
} = {
    root: ScrollAreaElement,
    viewport: ScrollAreaViewportElement,
    content: ScrollAreaContentElement,
    scrollbar: ScrollAreaScrollbarElement,
    thumb: ScrollAreaThumbElement,
    corner: ScrollAreaCornerElement
} as const;
export function define(options: DefineOptions) {
    registerElements('scroll-area', elements, options);
}
export type ScrollAreaElement = InstanceType<typeof ScrollAreaElement>;
export type ScrollAreaViewportElement = InstanceType<typeof ScrollAreaViewportElement>;
export type ScrollAreaContentElement = InstanceType<typeof ScrollAreaContentElement>;
export type ScrollAreaScrollbarElement = InstanceType<typeof ScrollAreaScrollbarElement>;
export type ScrollAreaThumbElement = InstanceType<typeof ScrollAreaThumbElement>;
export type ScrollAreaCornerElement = InstanceType<typeof ScrollAreaCornerElement>;
