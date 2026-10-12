import { ComboboxChipsMachine } from '@flippo-software/core-components/combobox';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { ComboboxChipsContext, ComboboxPart } from '../root/ComboboxRootContext';

/**
 * The chosen values of a `multiple` combobox, with the input. With a `<template>` child holding a
 * `<prefix>-combobox-chip`, it shows a copy of it for each value (before the template); otherwise, render the chips
 * yourself, in the order of the values. The arrow keys move between the chips.
 */
export class ComboboxChipsElement extends ComboboxPart.withAttributes({}) {
    private chips!: ComboboxChipsMachine;

    private rendered: (HTMLElement & { value?: unknown })[] = [];

    constructor() {
        super();
        declareProvider(this, ComboboxChipsContext);
    }

    get machine(): ComboboxChipsMachine {
        return this.chips;
    }

    protected override createParts() {
        this.chips = new ComboboxChipsMachine(this.root);
    }

    protected override applyOptions() {}

    protected override connectParts() {
        const disconnect = this.chips.connect();
        const stopProviding = provideContext(this, ComboboxChipsContext, this);
        const stopRendering = effect(() => {
            const { selectedValue } = this.root.store.state;
            untracked(() => this.renderChips(Array.isArray(selectedValue) ? selectedValue : []));
        });
        return () => {
            stopRendering();
            stopProviding();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.chips?.setElement(element as HTMLDivElement | null);
    }

    protected override getProps(): Props {
        return {};
    }

    private renderChips(values: readonly unknown[]) {
        const template = [...this.children].find((child): child is HTMLTemplateElement => child.localName === 'template');
        if (!template) {
            return;
        }
        const chip = template.content.firstElementChild;
        while (this.rendered.length > values.length) {
            this.rendered.pop()?.remove();
        }
        while (this.rendered.length < values.length && chip) {
            const element = chip.cloneNode(true) as HTMLElement;
            template.before(element);
            this.rendered.push(element);
        }
        values.forEach((value, index) => {
            const element = this.rendered[index];
            if (element) {
                element.value = value;
            }
        });
    }
}
