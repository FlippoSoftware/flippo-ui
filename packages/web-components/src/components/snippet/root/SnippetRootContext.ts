import type { SnippetMachine } from '@flippo-software/core-components/snippet';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext } from '../../../lib/context';

import type { SnippetElement } from './SnippetElement';

export const SnippetContext = createContext<SnippetElement>('snippet');

const SNIPPET_ROOT = [SnippetContext] as const;

export abstract class SnippetPart extends ContextPart<typeof SNIPPET_ROOT> {
    protected readonly contexts = SNIPPET_ROOT;

    protected get snippet(): SnippetMachine {
        return this.provided[0].machine;
    }
}
