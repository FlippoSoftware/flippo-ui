import { PinInputPinMachine } from '@flippo-software/core-components/pin-input';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { createId } from '../../../lib/createId';
import { PinInputPart } from '../root/PinInputRootContext';

/**
 * An input of one character: put it on an `<input>` with `as-child`.
 */
export class PinInputPinElement extends PinInputPart.withAttributes({}) {
    private pin!: PinInputPinMachine;

    private readonly generatedId = createId('pin-input-pin');

    protected override createParts() {
        this.pin = new PinInputPinMachine(this.pinInput, { id: this.targetId(this.generatedId) });
    }

    protected override applyOptions() {
        this.pin.setOptions({ id: this.targetId(this.generatedId) });
    }

    protected override connectParts() {
        return this.pin.connect();
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.pin?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.pin.getProps(), this.stateAttributes);
    }
}
