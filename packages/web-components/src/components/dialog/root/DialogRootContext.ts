import type { DialogChangeEventDetails, DialogRootMachine, DialogRootOptions } from '@flippo-software/core-components/dialog';
import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';

import type { DialogElement } from './DialogElement';

export type DialogOpenChangeDetail = {
    open: boolean;
    reason: DialogChangeEventDetails['reason'];
};

/**
 * The machine a dialog element drives: its options and its connection.
 */
export type DialogRootDriver = {
    setOptions(options: DialogRootOptions): void;
    afterCommit(): void;
    connect(): () => void;
};

export const DialogContext = createContext<DialogElement>('dialog');

const DIALOG_ROOT = [DialogContext] as const;

/**
 * Base of the parts of a dialog: they need the root.
 */
export abstract class DialogPart extends ContextPart<typeof DIALOG_ROOT> {
    protected readonly contexts = DIALOG_ROOT;

    protected get rootElement(): DialogElement {
        return this.provided[0];
    }

    protected get root(): DialogRootMachine {
        return this.rootElement.machine;
    }
}

/**
 * Base of the title and the description: an id the popup's `aria-labelledby`/`aria-describedby` refers to.
 */
export abstract class DialogLabelPart extends DialogPart.withAttributes({}) {
    private readonly generatedId: string;

    constructor(prefix: string) {
        super();
        this.generatedId = createId(prefix);
    }

    protected abstract register(id: string): () => void;

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return this.register(this.labelId);
    }

    protected override getProps(): Props {
        return { id: this.labelId };
    }

    /**
     * The id of the target: one written by the page is kept, otherwise the generated one is used.
     */
    private get labelId(): string {
        return this.targetId(this.generatedId);
    }
}
