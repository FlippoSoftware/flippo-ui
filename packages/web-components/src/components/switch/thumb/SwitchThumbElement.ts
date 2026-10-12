import { SwitchMachine } from '@flippo-software/core-components/switch';

import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { SWITCH } from '../root/SwitchRootContext';

abstract class SwitchPart extends ContextPart<typeof SWITCH> {
    protected readonly contexts = SWITCH;
}

/**
 * The movable part of the switch.
 *
 * State attributes: those of the switch.
 */
export class SwitchThumbElement extends SwitchPart.withAttributes({}) {
    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected override getProps(): Props {
        return SwitchMachine.attrs(this.provided[0].machine.getState());
    }
}
