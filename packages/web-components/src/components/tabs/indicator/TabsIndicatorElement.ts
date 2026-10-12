import { mergeProps } from '@flippo-software/core-components/props';
import { getTabsIndicatorGeometry, TabsMachine } from '@flippo-software/core-components/tabs';
import { Store } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { TabsListPart } from '../root/TabsRootContext';

/**
 * Follows the chosen tab: its position and size are in CSS variables (`--active-tab-left`, `--active-tab-width`…).
 *
 * State attributes: `data-orientation`, `data-activation-direction`.
 */
export class TabsIndicatorElement extends TabsListPart.withAttributes({}) {
    /**
     * Changes when the list is resized: the geometry is measured again.
     */
    private readonly layout = new Store({ revision: 0 });

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        const listElement = this.list.listElement;
        if (!listElement || typeof ResizeObserver === 'undefined') {
            return () => {};
        }
        const observer = new ResizeObserver(() => this.layout.set('revision', this.layout.state.revision + 1));
        observer.observe(listElement);
        return () => observer.disconnect();
    }

    protected override getProps(): Props {
        this.layout.state.revision;
        const { style, displayed } = getTabsIndicatorGeometry(this.tabs, this.list.store.state.listElement);
        return mergeProps(
            { role: 'presentation', style, hidden: !displayed || this.tabs.value == null },
            TabsMachine.attrs(this.tabs.getState())
        );
    }
}
