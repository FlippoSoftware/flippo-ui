import { AccordionMachine } from '@flippo-software/core-components/accordion';
import { mergeProps } from '@flippo-software/core-components/props';

import type { AccordionChangeEventDetails, AccordionOptions, AccordionValue } from '@flippo-software/core-components/accordion';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { MachineElement, property } from '../../../lib/MachineElement';

import { AccordionContext, type AccordionValueChangeDetail } from './AccordionRootContext';

const WHITESPACE = /\s+/;

/**
 * Sections whose content is shown or hidden with their header: the root of the `-accordion-*` parts.
 *
 * Attributes: `multiple` (several sections open at once), `disabled`, `orientation` (`vertical` by default,
 * `horizontal`), `loop-focus` (`"false"` stops the arrow keys at the ends), `hidden-until-found` (closed panels are
 * found by the browser's search, which opens them), `keep-mounted`, `default-value` (space-separated values of the
 * open items).
 * Properties: `value` (controlled; an array), `defaultValue` (an array).
 * Events: `value-change` (cancelable; `detail: { value, reason }`).
 * State attributes: `data-disabled`, `data-orientation`.
 */
export class AccordionElement extends MachineElement.withAttributes({
    /**
     * Whether multiple items can be open at the same time.
     * @default false
     */
    multiple: 'boolean',
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled: 'boolean',
    /**
     * The visual orientation of the accordion.
     * Controls whether roving focus uses left/right or up/down arrow keys.
     * @default 'vertical'
     */
    orientation: ['vertical', 'horizontal'],
    /**
     * Whether to loop keyboard focus back to the first item
     * when the end of the list is reached while using the arrow keys.
     * @default true
     */
    'loop-focus': 'boolean',
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
    'keep-mounted': 'boolean',
    /**
     * The uncontrolled value of the item(s) that should be initially expanded.
     *
     * To render a controlled accordion, use the `value` attribute instead.
     */
    'default-value': 'string',
    /**
     * The controlled value of the item(s) that should be expanded.
     *
     * To render an uncontrolled accordion, use the `default-value` attribute instead.
     */
    value: property<AccordionValue>()
}) {
    private accordion!: AccordionMachine;

    constructor() {
        super();
        declareProvider(this, AccordionContext);
    }

    get machine(): AccordionMachine {
        return this.accordion;
    }

    protected override createParts() {
        this.accordion = new AccordionMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.accordion.setOptions(this.getOptions());
    }

    protected override connectParts() {
        const disconnect = this.accordion.connect();
        const stopProviding = provideContext(this, AccordionContext, this);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override getProps(): Props {
        return mergeProps(this.accordion.getRootProps(), AccordionMachine.attrs(this.accordion.getState()));
    }

    private getOptions(): AccordionOptions {
        return {
            value: this.value,
            defaultValue: this.defaultValue?.split(WHITESPACE).filter(Boolean),
            multiple: this.multiple ?? false,
            disabled: this.disabled ?? false,
            orientation: this.orientation ?? 'vertical',
            loopFocus: this.loopFocus ?? true,
            hiddenUntilFound: this.hiddenUntilFound ?? false,
            keepMounted: this.keepMounted ?? false,
            direction: this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr',
            onValueChange: (value: AccordionValue, eventDetails: AccordionChangeEventDetails) => {
                this.emit('value-change', { value, reason: eventDetails.reason } satisfies AccordionValueChangeDetail, eventDetails);
            }
        };
    }
}
