import { TooltipRootMachine } from '@flippo-software/core-components/tooltip';

import type { Props } from '@flippo-software/core-components/props';
import type { TooltipChangeEventDetails, TooltipRootOptions } from '@flippo-software/core-components/tooltip';

import { declareProvider, provideContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { MachineElement } from '../../../lib/MachineElement';

import { TooltipContext, type TooltipOpenChangeDetail } from './TooltipRootContext';

/**
 * A popup with a short description of the trigger, opened on hover and focus: the root of the `-tooltip-*` parts.
 *
 * Attributes: `open` (controlled), `default-open`, `disabled`, `disable-hoverable-popup` (closes when the pointer leaves
 * the trigger, even towards the popup), `track-cursor-axis` (`none`, `x`, `y`, `both`).
 * Events: `open-change` (cancelable; `detail: { open, reason }`), `open-change-complete` (`detail: { open }`).
 */
export class TooltipElement extends MachineElement.withAttributes({
    open: 'boolean',
    'default-open': 'boolean',
    disabled: 'boolean',
    'disable-hoverable-popup': 'boolean',
    'track-cursor-axis': ['none', 'x', 'y', 'both']
}) {
    private rootMachine!: TooltipRootMachine;

    constructor() {
        super();
        declareProvider(this, TooltipContext);
    }

    get machine(): TooltipRootMachine {
        return this.rootMachine;
    }

    protected override createParts() {
        this.rootMachine = new TooltipRootMachine(this.getOptions(), { floatingId: createId('tooltip-popup') });
    }

    protected override applyOptions() {
        this.rootMachine.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.rootMachine.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.rootMachine.connect();
        const stopProviding = provideContext(this, TooltipContext, this);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override getProps(): Props {
        return {};
    }

    private getOptions(): TooltipRootOptions {
        return {
            open: this.open,
            defaultOpen: this.defaultOpen ?? false,
            disabled: this.disabled ?? false,
            disableHoverablePopup: this.disableHoverablePopup ?? false,
            trackCursorAxis: this.trackCursorAxis ?? 'none',
            onOpenChange: (open: boolean, eventDetails: TooltipChangeEventDetails) => {
                this.emit('open-change', { open, reason: eventDetails.reason } satisfies TooltipOpenChangeDetail, eventDetails);
            },
            onOpenChangeComplete: (open: boolean) => {
                this.emit('open-change-complete', { open });
            }
        };
    }
}
