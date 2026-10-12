import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { SnippetCopyButtonElement } from './copy-button/SnippetCopyButtonElement';
import { SnippetLineElement } from './line/SnippetLineElement';
import { SnippetElement } from './root/SnippetElement';
import { SnippetSymbolElement } from './symbol/SnippetSymbolElement';

export * from './copy-button/SnippetCopyButtonElement';
export * from './line/SnippetLineElement';
export * from './root/SnippetElement';
export * from './root/SnippetRootContext';
export * from './symbol/SnippetSymbolElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: SnippetElement,
    line: SnippetLineElement,
    symbol: SnippetSymbolElement,
    copyButton: SnippetCopyButtonElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-snippet…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('snippet', elements, options);
}
