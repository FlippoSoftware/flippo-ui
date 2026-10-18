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
    /**
     * Focus mode for the focus funnel
     * - 'last-active': Focus on the last active input (default)
     * - 'first-empty': Focus on the first empty input
     * - 'first': Always focus on the first input
     */
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
