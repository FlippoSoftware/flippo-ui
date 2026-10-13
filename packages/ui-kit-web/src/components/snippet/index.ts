import { iconMarkup } from '@flippo-software/component-styles/icons';
import { snippet as recipe } from '@flippo-software/component-styles/snippet';
import * as Primitive from '@flippo-software/web-components/snippet';

import { registerElements } from '~@lib/register';
import { styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const SnippetElement: StyledConstructor<typeof Primitive.SnippetElement, typeof recipe> = styled(
    Primitive.SnippetElement,
    recipe,
    'snippet',
    'root',
    true
);
export const SnippetLineElement: StyledConstructor<typeof Primitive.SnippetLineElement, typeof recipe> = styled(
    Primitive.SnippetLineElement,
    recipe,
    'snippet',
    'line',
    false
);
export const SnippetSymbolElement: StyledConstructor<typeof Primitive.SnippetSymbolElement, typeof recipe> = styled(
    Primitive.SnippetSymbolElement,
    recipe,
    'snippet',
    'symbol',
    false
);
export const SnippetCopyButtonElement: StyledConstructor<typeof Primitive.SnippetCopyButtonElement, typeof recipe> = styled(
    Primitive.SnippetCopyButtonElement,
    recipe,
    'snippet',
    'copyButton',
    false,
    undefined,
    { content: iconMarkup('copy') }
);
export const elements: {
    readonly root: typeof SnippetElement;
    readonly line: typeof SnippetLineElement;
    readonly symbol: typeof SnippetSymbolElement;
    readonly copyButton: typeof SnippetCopyButtonElement;
} = { root: SnippetElement, line: SnippetLineElement, symbol: SnippetSymbolElement, copyButton: SnippetCopyButtonElement } as const;
export function define(options: DefineOptions) {
    registerElements('snippet', elements, options);
}
export type SnippetElement = InstanceType<typeof SnippetElement>;
export type SnippetLineElement = InstanceType<typeof SnippetLineElement>;
export type SnippetSymbolElement = InstanceType<typeof SnippetSymbolElement>;
export type SnippetCopyButtonElement = InstanceType<typeof SnippetCopyButtonElement>;
