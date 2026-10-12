import type { Props } from '@flippo-software/core-components/props';

import { FallbackText } from '../../../lib/FallbackText';
import { MeterPart } from '../root/MeterRootContext';

/**
 * The formatted value, as text (when the element has no content of its own).
 */
export class MeterValueElement extends MeterPart.withAttributes({}) {
    private readonly text = new FallbackText(this);

    protected override getProps(): Props {
        this.text.set(String(this.meter.getValueText()));
        return { 'aria-hidden': true };
    }
}
