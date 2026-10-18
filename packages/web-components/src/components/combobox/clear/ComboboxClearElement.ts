import { ComboboxClearMachine } from '@flippo-software/core-components/combobox';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { ComboboxPart } from '../root/ComboboxRootContext';

/**
 * A button that clears the value and the text; hidden while there is nothing to clear (unless `keep-mounted`).
 *
 * Attributes: `disabled`, `keep-mounted`.
 * State attributes: `data-popup-open`, `data-disabled`, transition attributes.
 */
export class ComboboxClearElement extends ComboboxPart.withAttributes({
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled: 'boolean',
    /**
     * Whether the component should remain mounted in the DOM when not visible.
     * @default false
     */
    'keep-mounted': 'boolean'
}) {
    private clear!: ComboboxClearMachine;

    protected override createParts() {
        this.clear = new ComboboxClearMachine(this.root, this.getOptions());
    }

    protected override applyOptions() {
        this.clear.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.clear.afterCommit();
    }

    protected override connectParts() {
        return this.clear.connect();
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.clear?.setElement(element as HTMLButtonElement | null);
    }

    protected override getProps(): Props {
        return mergeProps(this.clear.getClearProps(), ComboboxClearMachine.attrs(this.clear.getState()), {
            hidden: !this.clear.shouldRender(this.keepMounted ?? false)
        });
    }

    private getOptions() {
        return { disabled: this.disabled ?? false, nativeButton: this.target?.localName === 'button' };
    }
}
