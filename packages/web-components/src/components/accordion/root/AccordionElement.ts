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
    multiple: 'boolean',
    disabled: 'boolean',
    orientation: ['vertical', 'horizontal'],
    'loop-focus': 'boolean',
    'hidden-until-found': 'boolean',
    'keep-mounted': 'boolean',
    'default-value': 'string',
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
