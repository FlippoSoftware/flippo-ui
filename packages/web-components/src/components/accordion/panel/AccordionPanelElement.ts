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
    'hidden-until-found': 'boolean',
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
