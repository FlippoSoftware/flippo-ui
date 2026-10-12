import { mergeProps } from '@flippo-software/core-components/props';
import { registerToastLabel, type ToastProviderMachine } from '@flippo-software/core-components/toast';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';
import type { ToastObject } from '@flippo-software/core-components/toast';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { FallbackText } from '../../../lib/FallbackText';

import type { ToastProviderElement } from '../provider/ToastProviderElement';

import type { ToastElement } from './ToastElement';

export const ToastProviderContext = createContext<ToastProviderElement>('toast-provider');

export const ToastRootContext = createContext<ToastElement>('toast');

const TOAST_PROVIDER = [ToastProviderContext] as const;

export abstract class ToastProviderPart extends ContextPart<typeof TOAST_PROVIDER> {
    protected readonly contexts = TOAST_PROVIDER;

    protected get provider(): ToastProviderMachine {
        return this.provided[0].machine;
    }
}

const TOAST = [ToastProviderContext, ToastRootContext] as const;

export abstract class ToastPart extends ContextPart<typeof TOAST> {
    protected readonly contexts = TOAST;

    protected get provider(): ToastProviderMachine {
        return this.provided[0].machine;
    }

    protected get toastElement(): ToastElement {
        return this.provided[1];
    }

    protected get toast(): ToastObject {
        return this.toastElement.toast as ToastObject;
    }

    protected get typeAttributes(): Props {
        return this.toast.type ? { 'data-type': this.toast.type } : {};
    }
}

/**
 * Base of the title and the description: the text of the toast object (unless the element has its own), and an id
 * the toast refers to. Hidden without text.
 */
export abstract class ToastLabelPart extends ToastPart.withAttributes({}) {
    private readonly text = new FallbackText(this);

    private readonly generatedId: string;

    constructor(prefix: string) {
        super();
        this.generatedId = createId(prefix);
    }

    protected abstract getText(): string | undefined;

    protected abstract setId(id: string | undefined): void;

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return effect(() => {
            if (this.hasText()) {
                return untracked(() => registerToastLabel((id) => this.setId(id), this.targetId(this.generatedId)));
            }
            return;
        });
    }

    protected override getProps(): Props {
        this.text.set(this.getText());
        return mergeProps({ id: this.targetId(this.generatedId), hidden: !this.hasText() }, this.typeAttributes);
    }

    private hasText(): boolean {
        return Boolean(this.getText()) || (this.textContent ?? '').trim() !== '';
    }
}
