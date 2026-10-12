import { SnippetMachine } from '@flippo-software/core-components/snippet';

import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { MachineElement } from '../../../lib/MachineElement';

import { SnippetContext } from './SnippetRootContext';

/**
 * Lines of code to copy (a command to run): the root of the `-snippet-*` parts.
 *
 * Attributes: `symbol` (the prompt shown by `<prefix>-snippet-symbol`; `$`), `disable-copy`.
 * State attributes: `data-disable-copy`.
 */
export class SnippetElement extends MachineElement.withAttributes({
    symbol: 'string',
    'disable-copy': 'boolean'
}) {
    private snippet!: SnippetMachine;

    constructor() {
        super();
        declareProvider(this, SnippetContext);
    }

    get machine(): SnippetMachine {
        return this.snippet;
    }

    protected override createParts() {
        this.snippet = new SnippetMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.snippet.setOptions(this.getOptions());
    }

    protected override connectParts() {
        const disconnect = this.snippet.connect();
        const stopProviding = provideContext(this, SnippetContext, this);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override getProps(): Props {
        const { disableCopy } = this.snippet.getState();
        return disableCopy ? { 'data-disable-copy': '' } : {};
    }

    private getOptions() {
        return { symbol: this.symbol ?? '$', disableCopy: this.disableCopy ?? false };
    }
}
