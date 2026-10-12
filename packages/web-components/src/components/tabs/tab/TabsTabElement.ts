import { getStyleHookProps } from '@flippo-software/core-components/attributes';
import { mergeProps } from '@flippo-software/core-components/props';
import { TabsTabMachine } from '@flippo-software/core-components/tabs';

import type { Props } from '@flippo-software/core-components/props';

import { createId } from '../../../lib/createId';
import { TabsListPart } from '../root/TabsRootContext';

/**
 * A tab: it shows its panel.
 *
 * Attributes: `value`, `disabled`.
 * State attributes: `data-active`, `data-disabled`, `data-orientation`.
 */
export class TabsTabElement extends TabsListPart.withAttributes({
    value: 'string',
    disabled: 'boolean'
}) {
    private tab!: TabsTabMachine;

    private readonly generatedId = createId('tabs-tab');

    protected override createParts() {
        this.tab = new TabsTabMachine(this.tabs, this.list, this.getOptions());
    }

    protected override applyOptions() {
        this.tab.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.tab.afterCommit();
    }

    protected override connectParts() {
        return this.tab.connect();
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.tab?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.tab.getProps(), getStyleHookProps(this.tab.getState()));
    }

    private getOptions() {
        return {
            id: this.targetId(this.generatedId),
            value: this.value,
            disabled: this.disabled ?? false,
            nativeButton: this.target?.localName === 'button'
        };
    }
}
