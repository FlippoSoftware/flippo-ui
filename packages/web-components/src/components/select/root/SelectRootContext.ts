import { mergeProps } from '@flippo-software/core-components/props';
import { type SelectItemMachine, type SelectRootMachine, SelectScrollArrowMachine } from '@flippo-software/core-components/select';

import type { Props } from '@flippo-software/core-components/props';
import type { SelectChangeEventDetails } from '@flippo-software/core-components/select';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext } from '../../../lib/context';

import type { SelectGroupElement } from '../group/SelectGroupElement';
import type { SelectItemElement } from '../item/SelectItemElement';
import type { SelectPositionerElement } from '../positioner/SelectPositionerElement';

import type { SelectElement } from './SelectElement';

export type SelectValueChangeDetail = {
    value: unknown;
    reason: SelectChangeEventDetails['reason'];
};

export type SelectOpenChangeDetail = {
    open: boolean;
    reason: SelectChangeEventDetails['reason'];
};

export const SelectContext = createContext<SelectElement>('select');

export const SelectPositionerContext = createContext<SelectPositionerElement>('select-positioner');

const SELECT_ROOT = [SelectContext] as const;

const SELECT_ROOT_AND_POSITIONER = [SelectContext, SelectPositionerContext] as const;

/**
 * Base of the parts of a select: they need the root.
 */
export abstract class SelectPart extends ContextPart<typeof SELECT_ROOT> {
    protected readonly contexts = SELECT_ROOT;

    protected get rootElement(): SelectElement {
        return this.provided[0];
    }

    protected get root(): SelectRootMachine {
        return this.rootElement.machine;
    }
}

/**
 * Base of the parts inside the positioner: the popup, the list, the items…
 */
export abstract class SelectPositionedPart extends ContextPart<typeof SELECT_ROOT_AND_POSITIONER> {
    protected readonly contexts = SELECT_ROOT_AND_POSITIONER;

    protected get rootElement(): SelectElement {
        return this.provided[0];
    }

    protected get root(): SelectRootMachine {
        return this.rootElement.machine;
    }

    protected get positionerElement(): SelectPositionerElement {
        return this.provided[1];
    }
}

export const SelectItemContext = createContext<SelectItemElement>('select-item');

export const SelectGroupContext = createContext<SelectGroupElement>('select-group');

const SELECT_ITEM = [SelectItemContext] as const;

export abstract class SelectItemPart extends ContextPart<typeof SELECT_ITEM> {
    protected readonly contexts = SELECT_ITEM;

    protected get item(): SelectItemMachine {
        return this.provided[0].machine;
    }

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }
}

export const SELECT_GROUP = [SelectGroupContext] as const;

/**
 * Base of the arrows that scroll the list while hovered, shown while it can scroll that way.
 */
export abstract class SelectScrollArrowPart extends SelectPositionedPart.withAttributes({
    'keep-mounted': 'boolean'
}) {
    protected abstract readonly direction: 'up' | 'down';

    private arrow!: SelectScrollArrowMachine;

    protected override createParts() {
        this.arrow = new SelectScrollArrowMachine(this.root as SelectRootMachine, this.positionerElement.machine, this.direction);
    }

    protected override applyOptions() {}

    protected override connectParts() {
        return this.arrow.connect();
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.arrow?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.arrow.getProps(), { hidden: !this.arrow.shouldRender(this.keepMounted ?? false) });
    }
}
