import { DialogBackdrop } from '@flippo-software/core-components/dialog';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { prepareTopLayer, releaseTopLayer } from '../../../lib/topLayer';
import { DialogPart } from '../root/DialogRootContext';

/**
 * A backdrop below the popup, shown in the top layer. Style it to cover the viewport, e.g.
 * `position: fixed; inset: 0`. Nested dialogs do not render theirs unless it has `force-render`.
 *
 * Attributes: `force-render`.
 * State attributes: `data-open`/`data-closed`, transition attributes.
 */
export class DialogBackdropElement extends DialogPart.withAttributes({
    /**
     * Whether the backdrop is forced to render even when nested.
     * @default false
     */
    'force-render': 'boolean'
}) {
    protected override createParts() {}

    protected override applyOptions() {
        this.rootElement.parts.set('forceRenderBackdrop', this.forceRender ?? false);
    }

    protected override connectParts() {
        return () => {};
    }

    protected override onTargetChange(element: HTMLElement | null) {
        DialogBackdrop.setElement(this.root.store, element as HTMLDivElement | null);
        if (element) {
            prepareTopLayer(element);
        }
        this.rootElement.parts.set('backdrop', element);
    }

    protected override onTargetRelease(element: HTMLElement) {
        releaseTopLayer(element);
    }

    protected override getProps(): Props {
        return mergeProps(DialogBackdrop.getProps(this.root.store), DialogBackdrop.attrs(DialogBackdrop.getState(this.root.store)));
    }
}
