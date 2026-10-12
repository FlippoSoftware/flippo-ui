import { mergeProps } from '@flippo-software/core-components/props';
import { TabsListMachine, TabsMachine } from '@flippo-software/core-components/tabs';

import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { TabsListContext, TabsPart } from '../root/TabsRootContext';

/**
 * The row of tabs; the arrow keys move between them.
 *
 * Attributes: `activate-on-focus` (a tab is chosen when it gets the focus), `loop-focus` (`"false"` stops at the
 * ends).
 * State attributes: `data-orientation`, `data-activation-direction`.
 */
export class TabsListElement extends TabsPart.withAttributes({
    'activate-on-focus': 'boolean',
    'loop-focus': 'boolean'
}) {
    private list!: TabsListMachine;

    constructor() {
        super();
        declareProvider(this, TabsListContext);
    }

    get machine(): TabsListMachine {
        return this.list;
    }

    protected override createParts() {
        this.list = new TabsListMachine(this.tabs, this.getOptions());
    }

    protected override applyOptions() {
        this.list.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.list.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.list.connect();
        const stopProviding = provideContext(this, TabsListContext, this);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.list?.setListElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.list.getRootProps(), TabsMachine.attrs(this.list.getState()));
    }

    private getOptions() {
        return { activateOnFocus: this.activateOnFocus ?? false, loopFocus: this.loopFocus ?? true };
    }
}
