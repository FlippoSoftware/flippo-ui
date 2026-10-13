import { untracked } from '@flippo-software/store';

import { getStyleHookProps } from '~@attributes/getStyleHookProps';
import { ListRegistry } from '~@components/composite/list/ListRegistry';
import { Connectable } from '~@lib/Connectable';
import { OptionsStore } from '~@lib/OptionsStore';

import { snippetRootStateAttributesMapping } from './snippetRootStateAttributesMapping';

export type SnippetState = {
    disableCopy: boolean;
    symbol?: string | undefined;
};

export type SnippetOptions = {
    /**
     * @default false
     */
    disableCopy?: boolean | undefined;
    /**
     * Prompt symbol (only a string symbol is exposed in the state).
     * @default '$'
     */
    symbol?: unknown;
};

/**
 * State of a code snippet: its lines (in DOM order) and copying them to the clipboard.
 */
export class SnippetMachine extends Connectable {
    readonly registry = new ListRegistry<{ text: string | null | undefined }>();

    /**
     * The options, in a store: computed values and effects reading them follow their changes, key by key.
     */
    private readonly optionsStore = new OptionsStore<SnippetOptions>({} as SnippetOptions);

    private get options(): SnippetOptions {
        return this.optionsStore.state;
    }

    private set options(options: SnippetOptions) {
        this.optionsStore.setState(options);
    }

    constructor(options: SnippetOptions = {}) {
        super();
        this.options = options;
    }

    protected override onConnect() {
        this.connectChild(this.registry);
    }

    setOptions(options: SnippetOptions) {
        // What the machine reads while applying its options is not a dependency of the caller (e.g. an effect).
        untracked(() => {
            this.options = options;
        });
    }

    get disableCopy() {
        return this.options.disableCopy ?? false;
    }

    getState(): SnippetState {
        const symbol = this.options.symbol ?? '$';
        return { disableCopy: this.disableCopy, symbol: typeof symbol === 'string' ? symbol : undefined };
    }

    static attrs(state: SnippetState): Record<string, string> {
        return getStyleHookProps(state, snippetRootStateAttributesMapping);
    }

    /**
     * Text of all lines joined with new lines.
     */
    getText() {
        return Array.from(this.registry.getMap().values())
            .map((metadata) => metadata.text)
            .filter(Boolean)
            .join('\n');
    }

    protected override onDisconnect() {}
}
