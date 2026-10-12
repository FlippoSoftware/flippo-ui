import type { PopoverChangeEventDetails, PopoverRootMachine } from '@flippo-software/core-components/popover';
import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';

import type { PopoverPositionerElement } from '../positioner/PopoverPositionerElement';

import type { PopoverElement } from './PopoverElement';

export type PopoverOpenChangeDetail = {
    open: boolean;
    reason: PopoverChangeEventDetails['reason'];
};

export const PopoverContext = createContext<PopoverElement>('popover');

export const PopoverPositionerContext = createContext<PopoverPositionerElement>('popover-positioner');

/**
 * Base of the parts that need the root.
 */
const POPOVER_ROOT = [PopoverContext] as const;

const POPOVER_ROOT_AND_POSITIONER = [PopoverContext, PopoverPositionerContext] as const;

export abstract class PopoverPart extends ContextPart<typeof POPOVER_ROOT> {
    protected readonly contexts = POPOVER_ROOT;

    protected get rootElement(): PopoverElement {
        return this.provided[0];
    }

    /**
     * The machine of the root.
     */
    protected get root(): PopoverRootMachine {
        return this.rootElement.machine;
    }
}

/**
 * Base of the title and the description: an id the popup's `aria-labelledby`/`aria-describedby` refers to.
 */
export abstract class PopoverLabelPart extends PopoverPart.withAttributes({}) {
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
     * The id of the target: one written by the page is kept, otherwise the generated one is used. (Not `id`, which
     * is the standard property of the element.)
     */
    private get labelId(): string {
        return this.targetId(this.generatedId);
    }
}

/**
 * Base of the parts inside the positioner: they need the root and the positioner.
 */
export abstract class PopoverPositionedPart extends ContextPart<typeof POPOVER_ROOT_AND_POSITIONER> {
    protected readonly contexts = POPOVER_ROOT_AND_POSITIONER;

    protected get rootElement(): PopoverElement {
        return this.provided[0];
    }

    protected get positionerElement(): PopoverPositionerElement {
        return this.provided[1];
    }

    protected get root(): PopoverRootMachine {
        return this.rootElement.machine;
    }

    protected get positioner() {
        return this.positionerElement.machine;
    }
}
