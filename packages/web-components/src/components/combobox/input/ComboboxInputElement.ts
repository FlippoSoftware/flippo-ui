import { ComboboxInputMachine } from '@flippo-software/core-components/combobox';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { requestAncestorContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { ComboboxChipsElement } from '../chips/ComboboxChipsElement';
import { ComboboxChipsContext, ComboboxPart } from '../root/ComboboxRootContext';

/**
 * The text input: put it on an `<input>` with `as-child`. Typing filters the options and opens the list.
 *
 * Attributes: `disabled`.
 * State attributes: `data-popup-open`, `data-disabled`, `data-readonly`, and those of the field.
 */
export class ComboboxInputElement extends ComboboxPart.withAttributes({
    disabled: 'boolean'
}) {
    private input!: ComboboxInputMachine;

    private chips: ComboboxChipsElement | undefined;

    private cancelChipsRequest: (() => void) | null = null;

    private readonly generatedId = createId('combobox-input');

    protected override whenReady(callback: () => void) {
        super.whenReady(() => {
            this.cancelChipsRequest?.();
            this.cancelChipsRequest = requestAncestorContext(this, ComboboxChipsContext, ComboboxChipsElement, (chips) => {
                this.cancelChipsRequest = null;
                this.chips = chips;
                callback();
            });
        });
    }

    override disconnectedCallback() {
        this.cancelChipsRequest?.();
        this.cancelChipsRequest = null;
        super.disconnectedCallback();
    }

    protected override createParts() {
        this.input = new ComboboxInputMachine(this.root, this.getOptions(), {
            insidePopup: this.closest('[data-flippo-top-layer]') !== null,
            chips: this.chips?.machine ?? null,
            direction: this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr'
        });
    }

    protected override applyOptions() {
        this.input.setOptions(this.getOptions());
    }

    protected override connectParts() {
        return () => {};
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.input?.setElement(element as HTMLInputElement | null);
    }

    protected override getProps(): Props {
        const labelId = this.rootElement.labelableController?.labelId;
        return mergeProps(this.input.getInputProps({}, labelId), ComboboxInputMachine.attrs(this.input.getState()));
    }

    private getOptions() {
        return { id: this.targetId(this.generatedId), disabled: this.disabled ?? false };
    }
}
