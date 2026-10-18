import { CollapsibleMachine } from '@flippo-software/core-components/collapsible';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { CollapsiblePart } from '../root/CollapsibleRootContext';

/**
 * The panel the collapsible shows and hides. When closed, it is `hidden` (or `hidden="until-found"`) rather than
 * removed: the markup belongs to the page.
 *
 * Attributes: `hidden-until-found`, `keep-mounted`.
 * State attributes: `data-open`/`data-closed`, transition attributes.
 * CSS variables: `--collapsible-panel-height`, `--collapsible-panel-width`.
 */
export class CollapsiblePanelElement extends CollapsiblePart.withAttributes({
    /**
     * Allows the browser’s built-in page search to find and expand the panel contents.
     *
     * Overrides the `keep-mounted` attribute and uses `hidden="until-found"`
     * to hide the element without removing it from the DOM.
     * @default false
     */
    'hidden-until-found': 'boolean',
    /**
     * Whether to keep the element in the DOM while the panel is hidden.
     * This attribute is ignored when `hidden-until-found` is used.
     * @default false
     */
    'keep-mounted': 'boolean'
}) {
    protected override createParts() {}

    protected override applyOptions() {
        this.collapsible.setPanelOptions({
            // An id written by the page is kept; otherwise the generated one is used.
            id: this.target?.getAttribute('id') ?? undefined,
            hiddenUntilFound: this.hiddenUntilFound,
            keepMounted: this.keepMounted
        });
    }

    protected override connectParts() {
        return () => {};
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.collapsible?.setPanel(element);
    }

    protected override getProps(): Props {
        const props = this.collapsible.getPanelProps();
        // The panel stays in the document: where React would unmount it, it is hidden.
        const hidden = this.collapsible.shouldRenderPanel() ? Boolean(props.hidden) : true;
        return mergeProps(props, CollapsibleMachine.attrs(this.collapsible.getState()), {
            hidden: hidden && this.hiddenUntilFound ? 'until-found' : hidden
        });
    }
}
