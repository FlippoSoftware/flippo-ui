import { card as recipe } from '@flippo-software/component-styles/card';

import { registerElements } from '../../lib/register';
import { PresentationElement, styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const CardElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'card'> = styled(
    PresentationElement,
    recipe,
    'card',
    'root',
    true,
    'card'
);
export const CardContentElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'box'> = styled(
    PresentationElement,
    recipe,
    'card',
    'content',
    false,
    'box'
);
export const CardFooterElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'box'> = styled(
    PresentationElement,
    recipe,
    'card',
    'footer',
    false,
    'box'
);
export const CardTitleElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'box'> = styled(
    PresentationElement,
    recipe,
    'card',
    'title',
    false,
    'box'
);
export const CardDescriptionElement: StyledConstructor<typeof PresentationElement, typeof recipe, 'box'> = styled(
    PresentationElement,
    recipe,
    'card',
    'description',
    false,
    'box'
);
export const elements: {
    readonly root: typeof CardElement;
    readonly content: typeof CardContentElement;
    readonly footer: typeof CardFooterElement;
    readonly title: typeof CardTitleElement;
    readonly description: typeof CardDescriptionElement;
} = {
    root: CardElement,
    content: CardContentElement,
    footer: CardFooterElement,
    title: CardTitleElement,
    description: CardDescriptionElement
} as const;
export function define(options: DefineOptions) {
    registerElements('card', elements, options);
}
export type CardElement = InstanceType<typeof CardElement>;
export type CardContentElement = InstanceType<typeof CardContentElement>;
export type CardFooterElement = InstanceType<typeof CardFooterElement>;
export type CardTitleElement = InstanceType<typeof CardTitleElement>;
export type CardDescriptionElement = InstanceType<typeof CardDescriptionElement>;
