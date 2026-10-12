import { MenuBackdrop } from '@flippo-software/core-components/menu';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { prepareTopLayer, releaseTopLayer } from '../../../lib/topLayer';
import { MenuPart } from '../root/MenuRootContext';

/**
 * A layer below the menu, shown in the top layer while it is mounted. Style it to cover the viewport, e.g.
 * `position: fixed; inset: 0`.
 *
 * State attributes: `data-open`/`data-closed`, transition attributes.
 */
export class MenuBackdropElement extends MenuPart.withAttributes({}) {
    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected override onTargetChange(element: HTMLElement | null) {
        MenuBackdrop.setElement(this.root.store, element as HTMLDivElement | null);
        if (element) {
            prepareTopLayer(element);
        }
        this.rootElement.parts.set('backdrop', element);
    }

    protected override onTargetRelease(element: HTMLElement) {
        releaseTopLayer(element);
    }

    protected override getProps(): Props {
        return mergeProps(MenuBackdrop.getProps(this.root.store), MenuBackdrop.attrs(MenuBackdrop.getState(this.root.store)));
    }
}
