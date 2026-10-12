import { marquee as recipe } from '@flippo-software/component-styles/marquee';
import * as Primitive from '@flippo-software/web-components/marquee';

import { registerElements } from '../../lib/register';
import { styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const MarqueeElement: StyledConstructor<typeof Primitive.MarqueeElement, typeof recipe> = styled(
    Primitive.MarqueeElement,
    recipe,
    'marquee',
    'root',
    true
);
export const MarqueeTrackElement: StyledConstructor<typeof Primitive.MarqueeTrackElement, typeof recipe> = styled(
    Primitive.MarqueeTrackElement,
    recipe,
    'marquee',
    'track',
    false
);
export const elements: { readonly root: typeof MarqueeElement; readonly track: typeof MarqueeTrackElement } = {
    root: MarqueeElement,
    track: MarqueeTrackElement
} as const;
export function define(options: DefineOptions) {
    registerElements('marquee', elements, options);
}
export type MarqueeElement = InstanceType<typeof MarqueeElement>;
export type MarqueeTrackElement = InstanceType<typeof MarqueeTrackElement>;
