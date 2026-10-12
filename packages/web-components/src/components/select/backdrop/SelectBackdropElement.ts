import { mergeProps } from '@flippo-software/core-components/props';
import { SelectBackdrop } from '@flippo-software/core-components/select';

import type { Props } from '@flippo-software/core-components/props';

import { prepareTopLayer, releaseTopLayer } from '../../../lib/topLayer';
import { SelectPart } from '../root/SelectRootContext';

/**
 * A layer below the list, shown in the top layer while it is mounted. Style it to cover the viewport.
 *
 * State attributes: `data-open`/`data-closed`, transition attributes.
 */
export class SelectBackdropElement extends SelectPart.withAttributes({}) {
    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected override onTargetChange(element: HTMLElement | null) {
        if (element) {
            prepareTopLayer(element);
        }
        this.provided?.[0].parts.set('backdrop', element);
    }

    protected override onTargetRelease(element: HTMLElement) {
        releaseTopLayer(element);
    }

    protected override getProps(): Props {
        return mergeProps(SelectBackdrop.getProps(this.root), SelectBackdrop.attrs(SelectBackdrop.getState(this.root)));
    }
}
