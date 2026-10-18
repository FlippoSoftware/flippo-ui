import { CollapsibleMachine } from '@flippo-software/core-components/collapsible';

import type { CollapsibleChangeEventDetails } from '@flippo-software/core-components/collapsible';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { MachineElement } from '../../../lib/MachineElement';

import { CollapsibleContext, type CollapsibleOpenChangeDetail } from './CollapsibleRootContext';

/**
 * A collapsible panel controlled by a button: the root of `-collapsible-trigger` and `-collapsible-panel`.
 *
 * Attributes: `open` (controlled), `default-open`, `disabled`.
 * Events: `open-change` (cancelable; `detail: { open, reason }`).
 * State attributes: `data-open`/`data-closed`, `data-disabled`, transition attributes.
 */
export class CollapsibleElement extends MachineElement.withAttributes({
    /**
     * Whether the collapsible panel is currently open.
     *
     * To render an uncontrolled collapsible, use the `default-open` attribute instead.
     */
    open: 'boolean',
    /**
     * Whether the collapsible panel is initially open.
     *
     * To render a controlled collapsible, use the `open` attribute instead.
     * @default false
     */
    'default-open': 'boolean',
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled: 'boolean'
}) {
    private collapsible!: CollapsibleMachine;

    private readonly defaultPanelId = createId('collapsible-panel');

    constructor() {
        super();
        declareProvider(this, CollapsibleContext);
    }

    protected override createParts() {
        this.collapsible = new CollapsibleMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.collapsible.setOptions(this.getOptions());
    }

    protected override connectParts() {
        const disconnect = this.collapsible.connect();
        const stopProviding = provideContext(this, CollapsibleContext, this.collapsible);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override getProps(): Props {
        return CollapsibleMachine.attrs(this.collapsible.getState());
    }

    private getOptions() {
        return {
            open: this.open,
            defaultOpen: this.defaultOpen ?? false,
            disabled: this.disabled ?? false,
            defaultPanelId: this.defaultPanelId,
            onOpenChange: (open: boolean, eventDetails: CollapsibleChangeEventDetails) => {
                this.emit('open-change', { open, reason: eventDetails.reason } satisfies CollapsibleOpenChangeDetail, eventDetails);
            }
        };
    }
}
