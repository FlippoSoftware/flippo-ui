import { AccordionItemMachine } from '@flippo-software/core-components/accordion';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { AccordionItemPart } from '../root/AccordionRootContext';

/**
 * The content of a section, hidden while closed (`hidden="until-found"` with `hidden-until-found`).
 *
 * Attributes: `hidden-until-found`, `keep-mounted`.
 * State attributes: `data-open`, `data-disabled`, `data-orientation`, `data-index`, transition attributes.
 * CSS variables: `--accordion-panel-height`, `--accordion-panel-width`.
 */
export class AccordionPanelElement extends AccordionItemPart.withAttributes({
    /**
     * Allows the browser’s built-in page search to find and expand the panel contents.
     *
     * Overrides the `keep-mounted` attribute and uses `hidden="until-found"`
     * to hide the element without removing it from the DOM.
     * @default false
     */
    'hidden-until-found': 'boolean',
    /**
     * Whether to keep the element in the DOM while the panel is closed.
     * This attribute is ignored when `hidden-until-found` is used.
     * @default false
     */
    'keep-mounted': 'boolean'
}) {
    protected override applyOptions() {
        this.item.setPanelOptions({
            id: this.targetId('') || undefined,
            hiddenUntilFound: this.hiddenUntilFound,
            keepMounted: this.keepMounted
        });
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.item?.collapsible.setPanel(element);
    }

    protected override getProps(): Props {
        const { collapsible } = this.item;
        const props = this.item.getPanelProps();
        // The panel stays in the document: where React would unmount it, it is hidden.
        const hidden = collapsible.shouldRenderPanel() ? Boolean(props.hidden) : true;
        const untilFound = this.hiddenUntilFound ?? this.provided[0].accordion.hiddenUntilFound;
        return mergeProps(props, AccordionItemMachine.attrs(this.item.getPanelState()), {
            hidden: hidden && untilFound ? 'until-found' : hidden
        });
    }
}
