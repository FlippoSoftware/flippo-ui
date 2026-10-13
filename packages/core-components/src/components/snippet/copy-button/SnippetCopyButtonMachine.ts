import { untracked } from '@flippo-software/store';

import { ButtonMachine } from '~@components/button/root/ButtonMachine';
import { Connectable } from '~@lib/Connectable';
import { OptionsStore } from '~@lib/OptionsStore';
import { Clipboard } from '~@patterns/Clipboard';
import { mergeProps } from '~@props/mergeProps';

import type { Props } from '~@props/mergeProps';

import type { SnippetMachine } from '../root/SnippetMachine';

export type SnippetCopyButtonState = {
    disabled: boolean;
    copied: boolean;
};

export type SnippetCopyButtonOptions = {
    disabled?: boolean | undefined;
    /**
     * @default 2000
     */
    resetDelay?: number | undefined;
    onCopy?: ((value: string) => void) | undefined;
    onCopyError?: ((error: unknown) => void) | undefined;
    nativeButton?: boolean | undefined;
};

/**
 * The button that copies the snippet.
 */
export class SnippetCopyButtonMachine extends Connectable {
    readonly clipboard: Clipboard;

    readonly button: ButtonMachine;

    /**
     * The options, in a store: computed values and effects reading them follow their changes, key by key.
     */
    private readonly optionsStore = new OptionsStore<SnippetCopyButtonOptions>({} as SnippetCopyButtonOptions);

    private get options(): SnippetCopyButtonOptions {
        return this.optionsStore.state;
    }

    private set options(options: SnippetCopyButtonOptions) {
        this.optionsStore.setState(options);
    }

    private readonly snippet: SnippetMachine;

    constructor(snippet: SnippetMachine, options: SnippetCopyButtonOptions = {}) {
        super();
        this.snippet = snippet;
        this.options = options;
        this.clipboard = new Clipboard(options.resetDelay ?? 2000);
        this.button = new ButtonMachine({ disabled: this.disabled, native: options.nativeButton });
        this.clipboard.store.subscribe(() => this.button.setOptions({ disabled: this.disabled, native: this.options.nativeButton }));
    }

    setOptions(options: SnippetCopyButtonOptions) {
        // What the machine reads while applying its options is not a dependency of the caller (e.g. an effect).
        untracked(() => {
            this.options = options;
            this.clipboard.setResetDelay(options.resetDelay ?? 2000);
            this.button.setOptions({ disabled: this.disabled, native: options.nativeButton });
        });
    }

    get disabled() {
        return Boolean(this.snippet.disableCopy || this.options.disabled || this.clipboard.copied);
    }

    getState(): SnippetCopyButtonState {
        return { disabled: this.disabled, copied: this.clipboard.copied };
    }

    getProps(elementProps: Props = {}): Props {
        return this.button.getButtonProps(
            mergeProps(
                {
                    onClick: () => {
                        if (this.disabled) {
                            return;
                        }

                        try {
                            const textToCopy = this.snippet.getText();
                            this.clipboard.copy(textToCopy);
                            this.options.onCopy?.(textToCopy);
                        } catch (error) {
                            this.options.onCopyError?.(error);
                        }
                    }
                },
                elementProps
            )
        );
    }

    protected override onDisconnect() {
        this.clipboard.destroy();
    }
}
