import { mergeProps } from '@flippo-software/core-components/props';

import type { PinInputFocusMode } from '@flippo-software/core-components/pin-input';
import type { Props } from '@flippo-software/core-components/props';

import { PinInputPart } from '../root/PinInputRootContext';

/**
 * An area that sends the focus to a pin: a press on it focuses the pin chosen by `focus-mode`.
 *
 * Attributes: `focus-mode` (`first-empty` by default, `last-active`, `first`).
 */
export class PinInputFocusFunnelElement extends PinInputPart.withAttributes({
    'focus-mode': ['first-empty', 'last-active', 'first']
}) {
    protected override applyOptions() {
        this.pinInput.setFocusFunnelMode(this.focusMode as PinInputFocusMode | undefined);
    }

    protected override getProps(): Props {
        return mergeProps(
            this.pinInput.getFocusFunnelProps((this.focusMode as PinInputFocusMode | undefined) ?? 'first-empty'),
            this.stateAttributes
        );
    }
}
