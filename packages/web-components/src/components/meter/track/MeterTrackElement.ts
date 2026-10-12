import type { Props } from '@flippo-software/core-components/props';

import { MeterPart } from '../root/MeterRootContext';

/**
 * The track of the meter, containing the indicator.
 */
export class MeterTrackElement extends MeterPart.withAttributes({}) {
    protected override getProps(): Props {
        return {};
    }
}
