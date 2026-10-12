import { mergeProps } from '@flippo-software/core-components/props';
import { TabsMachine, TabsPanelMachine } from '@flippo-software/core-components/tabs';

import type { Props } from '@flippo-software/core-components/props';

import { createId } from '../../../lib/createId';
import { TabsPart } from '../root/TabsRootContext';

/**
 * The content of a tab, hidden while its tab is not chosen.
 *
 * Attributes: `value`.
 * State attributes: `data-hidden`, `data-orientation`, `data-activation-direction`, `data-index`.
 */
export class TabsPanelElement extends TabsPart.withAttributes({
    value: 'string'
}) {
    private panel!: TabsPanelMachine;

    private readonly generatedId = createId('tabs-panel');

    protected override createParts() {
        this.panel = new TabsPanelMachine(this.tabs, this.getOptions());
    }

    protected override applyOptions() {
        this.panel.setOptions(this.getOptions());
    }

    protected override connectParts() {
        return this.panel.connect();
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.panel?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.panel.getProps(), TabsMachine.attrs(this.panel.getState()));
    }

    private getOptions() {
        return { id: this.targetId(this.generatedId), value: this.value, keepMounted: true };
    }
}
