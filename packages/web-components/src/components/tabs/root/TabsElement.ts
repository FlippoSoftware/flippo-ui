import { TabsMachine } from '@flippo-software/core-components/tabs';

import type { Props } from '@flippo-software/core-components/props';
import type { TabsChangeEventDetails, TabsOptions } from '@flippo-software/core-components/tabs';

import { declareProvider, provideContext } from '../../../lib/context';
import { MachineElement } from '../../../lib/MachineElement';

import { TabsContext, type TabsValueChangeDetail } from './TabsRootContext';

/**
 * Panels of content, one shown at a time, chosen with tabs: the root of the `-tabs-*` parts.
 *
 * Attributes: `value` (controlled), `default-value` (the `value` of a tab; the first tab by default), `orientation`
 * (`horizontal` by default, `vertical`).
 * Events: `value-change` (cancelable; `detail: { value, reason, activationDirection }`).
 * State attributes: `data-orientation`, `data-activation-direction`.
 *
 * Tabs and panels without `value` are matched by their position.
 */
export class TabsElement extends MachineElement.withAttributes({
    /**
     * The value of the currently active `Tab`. Use when the component is controlled.
     * When the value is `null`, no Tab will be active.
     */
    value: 'string',
    /**
     * The default value. Use when the component is not controlled.
     * When the value is `null`, no Tab will be active.
     * @default 0
     */
    'default-value': 'string',
    /**
     * The component orientation (layout flow direction).
     * @default 'horizontal'
     */
    orientation: ['horizontal', 'vertical']
}) {
    private tabs!: TabsMachine;

    constructor() {
        super();
        declareProvider(this, TabsContext);
    }

    get machine(): TabsMachine {
        return this.tabs;
    }

    protected override createParts() {
        this.tabs = new TabsMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.tabs.setOptions(this.getOptions());
    }

    protected override connectParts() {
        const disconnect = this.tabs.connect();
        const stopProviding = provideContext(this, TabsContext, this);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override getProps(): Props {
        return TabsMachine.attrs(this.tabs.getState());
    }

    private getOptions(): TabsOptions {
        return {
            value: this.value,
            defaultValue: this.defaultValue ?? 0,
            orientation: this.orientation ?? 'horizontal',
            direction: this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr',
            onValueChange: (value: unknown, eventDetails: TabsChangeEventDetails) => {
                const detail: TabsValueChangeDetail = {
                    value,
                    reason: eventDetails.reason,
                    activationDirection: eventDetails.activationDirection
                };
                this.emit('value-change', detail, eventDetails);
            }
        };
    }
}
