import { ComboboxParts } from '@flippo-software/core-components/combobox';

import type { Props } from '@flippo-software/core-components/props';

import { prepareTopLayer, releaseTopLayer } from '../../../lib/topLayer';
import { ComboboxPart } from '../root/ComboboxRootContext';

/**
 * A layer below the list, shown in the top layer while it is mounted.
 *
 * State attributes: `data-open`/`data-closed`, transition attributes.
 */
export class ComboboxBackdropElement extends ComboboxPart.withAttributes({}) {
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
        return ComboboxParts.getBackdropProps(this.root);
    }
}
