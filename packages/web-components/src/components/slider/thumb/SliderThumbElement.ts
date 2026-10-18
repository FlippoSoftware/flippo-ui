import { mergeProps } from '@flippo-software/core-components/props';
import { SliderThumbMachine } from '@flippo-software/core-components/slider';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';
import type { SliderThumbOptions } from '@flippo-software/core-components/slider';

import { mirrorAriaReferences } from '../../../lib/ariaReferences';
import { createId } from '../../../lib/createId';
import { property } from '../../../lib/MachineElement';
import { PropsApplier } from '../../../lib/PropsApplier';
import { SliderPart } from '../root/SliderRootContext';

/**
 * A thumb: it is focusable (its `<input type="range">` is in its shadow root) and moves with the arrow keys.
 *
 * Attributes: `index` (in a range), `disabled`, `label` (the accessible name of the thumb).
 * Properties: `getAriaLabel`, `getAriaValueText`.
 * State attributes: `data-index`, `data-dragging`, `data-orientation`, `data-disabled`.
 */
export class SliderThumbElement extends SliderPart.withAttributes({
    /**
     * The index of the thumb in a range slider: the index of its value in the slider's `value`. Without it, the
     * position of the thumb among the thumbs.
     */
    index: 'number',
    /**
     * Whether the thumb should ignore user interaction.
     * @default false
     */
    disabled: 'boolean',
    /** The accessible name of the thumb. */
    label: 'string',
    /** A function which returns a string value for the [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label) attribute of the `input`. */
    getAriaLabel: property<SliderThumbOptions['getAriaLabel']>(),
    /**
     * A function which returns a string value for the [`aria-valuetext`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-valuetext) attribute of the `input`.
     * This is important for screen reader users.
     */
    getAriaValueText: property<SliderThumbOptions['getAriaValueText']>()
}) {
    private thumb!: SliderThumbMachine;

    private readonly input: HTMLInputElement;

    private readonly inputApplier = new PropsApplier();

    private readonly generatedId = createId('slider-thumb');

    private readonly defaultInputId = createId('slider-input');

    constructor() {
        super();
        const root = this.attachShadow({ mode: 'open' });
        this.input = this.ownerDocument.createElement('input');
        root.append(this.ownerDocument.createElement('slot'), this.input);
    }

    protected override createParts() {
        this.thumb = new SliderThumbMachine(this.slider, this.getOptions());
    }

    protected override applyOptions() {
        this.thumb.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.thumb.afterCommit();
    }

    protected override connectParts() {
        const { thumb, input } = this;
        const disconnect = thumb.connect();
        thumb.setInputElement(input);
        const stopApplying = effect(() => {
            const props = thumb.getInputProps();
            untracked(() => {
                this.inputApplier.apply(input, props);
                mirrorAriaReferences(input, this);
            });
        });
        return () => {
            stopApplying();
            thumb.setInputElement(null);
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.thumb?.setThumbElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.thumb.getProps({}, true), this.stateAttributes);
    }

    private getOptions(): SliderThumbOptions {
        const labelable = this.rootElement.labelableController;
        return {
            id: this.targetId(this.generatedId),
            defaultInputId: this.defaultInputId,
            labelableInputId: labelable?.resolveControlId(this.defaultInputId) ?? this.defaultInputId,
            index: this.index,
            disabled: this.disabled ?? false,
            'aria-label': this.label,
            getAriaLabel: this.getAriaLabel,
            getAriaValueText: this.getAriaValueText,
            labelable
        };
    }
}
