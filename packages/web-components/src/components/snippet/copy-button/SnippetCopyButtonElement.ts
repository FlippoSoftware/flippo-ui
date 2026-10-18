import { getStyleHookProps } from '@flippo-software/core-components/attributes';
import { mergeProps } from '@flippo-software/core-components/props';
import { SnippetCopyButtonMachine } from '@flippo-software/core-components/snippet';

import type { Props } from '@flippo-software/core-components/props';

import { SnippetPart } from '../root/SnippetRootContext';

/**
 * A button that copies the lines of the snippet.
 *
 * Attributes: `disabled`, `reset-delay` (ms the copied state lasts; 2000).
 * Events: `copied` (`detail: { value }`), `copy-error` (`detail: { error }`).
 * State attributes: `data-copied`, `data-disabled`.
 */
export class SnippetCopyButtonElement extends SnippetPart.withAttributes({
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled: 'boolean',
    /**
     * Time in milliseconds before resetting the copy status to idle.
     * @default 2000
     */
    'reset-delay': 'number'
}) {
    private copyButton!: SnippetCopyButtonMachine;

    protected override createParts() {
        this.copyButton = new SnippetCopyButtonMachine(this.snippet, this.getOptions());
    }

    protected override applyOptions() {
        this.copyButton.setOptions(this.getOptions());
    }

    protected override connectParts() {
        return this.copyButton.connect();
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.copyButton?.button.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.copyButton.getProps(), getStyleHookProps(this.copyButton.getState()));
    }

    private getOptions() {
        return {
            disabled: this.disabled ?? false,
            resetDelay: this.resetDelay ?? 2000,
            nativeButton: this.target?.localName === 'button',
            onCopy: (value: string) => {
                this.emit('copied', { value });
            },
            onCopyError: (error: unknown) => {
                this.emit('copy-error', { error });
            }
        };
    }
}
