import type { ComboboxChangeEventDetails, ComboboxRootMachine } from '@flippo-software/core-components/combobox';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext } from '../../../lib/context';

import type { ComboboxChipElement } from '../chip/ComboboxChipElement';
import type { ComboboxChipsElement } from '../chips/ComboboxChipsElement';
import type { ComboboxGroupElement } from '../group/ComboboxGroupElement';
import type { ComboboxItemElement } from '../item/ComboboxItemElement';
import type { ComboboxListElement } from '../list/ComboboxListElement';
import type { ComboboxPositionerElement } from '../positioner/ComboboxPositionerElement';

import type { ComboboxElement } from './ComboboxElement';

export type ComboboxValueChangeDetail = {
    value: unknown;
    reason: ComboboxChangeEventDetails['reason'];
};

export type ComboboxInputValueChangeDetail = {
    inputValue: string;
    reason: ComboboxChangeEventDetails['reason'];
};

export type ComboboxOpenChangeDetail = {
    open: boolean;
    reason: ComboboxChangeEventDetails['reason'];
};

/**
 * The machine a combobox element drives: pushes the options of the element, and connects.
 */
export type ComboboxRootDriver = {
    setOptions(): void;
    afterCommit(): void;
    connect(): () => void;
};

export const ComboboxContext = createContext<ComboboxElement>('combobox');

export const ComboboxPositionerContext = createContext<ComboboxPositionerElement>('combobox-positioner');

const COMBOBOX_ROOT = [ComboboxContext] as const;

const COMBOBOX_ROOT_AND_POSITIONER = [ComboboxContext, ComboboxPositionerContext] as const;

/**
 * Base of the parts of a combobox: they need the root.
 */
export abstract class ComboboxPart extends ContextPart<typeof COMBOBOX_ROOT> {
    protected readonly contexts = COMBOBOX_ROOT;

    protected get rootElement(): ComboboxElement {
        return this.provided[0];
    }

    protected get root(): ComboboxRootMachine {
        return this.rootElement.machine;
    }
}

/**
 * Base of the parts inside the positioner.
 */
export abstract class ComboboxPositionedPart extends ContextPart<typeof COMBOBOX_ROOT_AND_POSITIONER> {
    protected readonly contexts = COMBOBOX_ROOT_AND_POSITIONER;

    protected get rootElement(): ComboboxElement {
        return this.provided[0];
    }

    protected get root(): ComboboxRootMachine {
        return this.rootElement.machine;
    }

    protected get positionerElement(): ComboboxPositionerElement {
        return this.provided[1];
    }
}

export const ComboboxListContext = createContext<ComboboxListElement>('combobox-list');

export const ComboboxItemContext = createContext<ComboboxItemElement>('combobox-item');

export const ComboboxGroupContext = createContext<ComboboxGroupElement>('combobox-group');

export const COMBOBOX_ITEM = [ComboboxItemContext] as const;

export const COMBOBOX_GROUP = [ComboboxGroupContext] as const;

export const ComboboxChipsContext = createContext<ComboboxChipsElement>('combobox-chips');

export const ComboboxChipContext = createContext<ComboboxChipElement>('combobox-chip');

/**
 * The label of a value: through `itemToStringLabel`, or the value itself.
 */
export function labelOf(root: ComboboxRootMachine, value: unknown): string {
    const toLabel = root.store.state.itemToStringLabel;
    return toLabel ? toLabel(value) : String(value ?? '');
}

export const COMBOBOX_CHIPS = [ComboboxContext, ComboboxChipsContext] as const;

const COMBOBOX_CHIP = [ComboboxContext, ComboboxChipContext] as const;

export abstract class ComboboxChipPart extends ContextPart<typeof COMBOBOX_CHIP> {
    protected readonly contexts = COMBOBOX_CHIP;

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }
}
