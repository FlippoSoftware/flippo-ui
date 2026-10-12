import type { Props } from '@flippo-software/core-components/props';

import { MeterPart } from '../root/MeterRootContext';

/**
 * The filled part of the track: its width (`inset-inline-start` + `width`) follows the value.
 */
export class MeterIndicatorElement extends MeterPart.withAttributes({}) {
    protected override getProps(): Props {
        return { style: this.meter.getIndicatorStyle() };
    }
}
