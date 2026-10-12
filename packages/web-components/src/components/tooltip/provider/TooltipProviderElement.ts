import { TooltipProviderMachine } from '@flippo-software/core-components/tooltip';

import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { MachineElement } from '../../../lib/MachineElement';
import { TooltipProviderContext } from '../root/TooltipRootContext';

/**
 * Shares delays between the tooltips inside it: once one is open, moving to another opens it right away.
 *
 * Attributes: `delay` (ms before opening), `close-delay` (ms before closing), `timeout` (ms during which another
 * tooltip opens instantly after one closes; 400 by default).
 */
export class TooltipProviderElement extends MachineElement.withAttributes({
    delay: 'number',
    'close-delay': 'number',
    timeout: 'number'
}) {
    private providerMachine!: TooltipProviderMachine;

    constructor() {
        super();
        declareProvider(this, TooltipProviderContext);
    }

    get machine(): TooltipProviderMachine {
        return this.providerMachine;
    }

    protected override createParts() {
        this.providerMachine = new TooltipProviderMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.providerMachine.setOptions(this.getOptions());
    }

    protected override connectParts() {
        return provideContext(this, TooltipProviderContext, this);
    }

    protected override getProps(): Props {
        return {};
    }

    private getOptions() {
        return { delay: this.delay, closeDelay: this.closeDelay, timeout: this.timeout ?? 400 };
    }
}
