import { AccordionItemMachine, type AccordionMachine } from '@flippo-software/core-components/accordion';

import type { CollapsibleChangeEventDetails } from '@flippo-software/core-components/collapsible';
import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { declareProvider, provideContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { ACCORDION, AccordionItemContext, type AccordionItemOpenChangeDetail } from '../root/AccordionRootContext';

abstract class AccordionPart extends ContextPart<typeof ACCORDION> {
    protected readonly contexts = ACCORDION;
}

/**
 * A section: its header and its panel.
 *
 * Attributes: `value` (an id by default), `disabled`.
 * Events: `open-change` (cancelable; `detail: { open, reason }`).
 * State attributes: `data-open`, `data-disabled`, `data-orientation`, `data-index`.
 */
export class AccordionItemElement extends AccordionPart.withAttributes({
    value: 'string',
    disabled: 'boolean'
}) {
    private item!: AccordionItemMachine;

    private readonly fallbackValue = createId('accordion-item');

    private readonly defaultTriggerId = createId('accordion-trigger');

    private readonly defaultPanelId = createId('accordion-panel');

    constructor() {
        super();
        declareProvider(this, AccordionItemContext);
    }

    get machine(): AccordionItemMachine {
        return this.item;
    }

    /**
     * The machine of the accordion the item is in.
     */
    get accordion(): AccordionMachine {
        return this.provided[0].machine;
    }

    protected override createParts() {
        this.item = new AccordionItemMachine(this.provided[0].machine, this.getOptions());
    }

    protected override applyOptions() {
        this.item.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.item.sync();
    }

    protected override connectParts() {
        const disconnect = this.item.connect();
        const stopProviding = provideContext(this, AccordionItemContext, this);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.item?.listItem.setElement(element);
    }

    protected override getProps(): Props {
        return AccordionItemMachine.attrs(this.item.getState());
    }

    private getOptions() {
        return {
            value: this.value,
            disabled: this.disabled,
            fallbackValue: this.fallbackValue,
            defaultTriggerId: this.defaultTriggerId,
            defaultPanelId: this.defaultPanelId,
            onOpenChange: (open: boolean, eventDetails: CollapsibleChangeEventDetails) => {
                this.emit('open-change', { open, reason: eventDetails.reason } satisfies AccordionItemOpenChangeDetail, eventDetails);
            }
        };
    }
}
