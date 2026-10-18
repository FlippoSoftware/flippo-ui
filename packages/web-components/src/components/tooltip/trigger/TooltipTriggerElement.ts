import { mergeProps } from '@flippo-software/core-components/props';
import { TooltipTriggerMachine } from '@flippo-software/core-components/tooltip';

import type { Props } from '@flippo-software/core-components/props';

import { requestAncestorContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { TooltipProviderElement } from '../provider/TooltipProviderElement';
import { TooltipPart, TooltipProviderContext } from '../root/TooltipRootContext';

/**
 * The element the tooltip describes; it opens the tooltip on hover and focus.
 *
 * Attributes: `delay`, `close-delay` (ms; by default those of the provider), `disabled`, `primary` (the trigger the
 * tooltip is anchored to when it opens programmatically).
 * State attributes: `data-popup-open`.
 */
export class TooltipTriggerElement extends TooltipPart.withAttributes({
    /**
     * How long to wait before opening the tooltip. Specified in milliseconds.
     * @default 600
     */
    delay: 'number',
    /**
     * How long to wait before closing the tooltip. Specified in milliseconds.
     * @default 0
     */
    'close-delay': 'number',
    /**
     * Whether the trigger does not open the tooltip.
     * @default false
     */
    disabled: 'boolean',
    /**
     * Marks this trigger as the primary trigger for positioning.
     * Used when the tooltip is opened via TooltipMultiple sync.
     * If multiple triggers are marked as primary, the first one wins.
     * @default false
     */
    primary: 'boolean'
}) {
    private trigger!: TooltipTriggerMachine;

    private provider: TooltipProviderElement | undefined;

    private cancelProviderRequest: (() => void) | null = null;

    private readonly generatedId = createId('tooltip-trigger');

    /**
     * After the root: waits for the provider around it, if any.
     */
    protected override whenReady(callback: () => void) {
        super.whenReady(() => {
            this.cancelProviderRequest?.();
            this.cancelProviderRequest = requestAncestorContext(this, TooltipProviderContext, TooltipProviderElement, (provider) => {
                this.cancelProviderRequest = null;
                this.provider = provider;
                callback();
            });
        });
    }

    override disconnectedCallback() {
        this.cancelProviderRequest?.();
        this.cancelProviderRequest = null;
        super.disconnectedCallback();
    }

    protected override createParts() {
        const provider = this.provider?.machine;
        this.trigger = new TooltipTriggerMachine(this.root.store, this.getOptions(), {
            delayGroup: provider?.delayGroup,
            providerDelay: provider?.delay
        });
    }

    protected override applyOptions() {
        this.trigger.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.trigger.afterCommit();
    }

    protected override connectParts() {
        return this.trigger.connect();
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.trigger?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.trigger.getTriggerProps(), TooltipTriggerMachine.attrs(this.trigger.getState()));
    }

    private getOptions() {
        return {
            // An id written by the page is kept; otherwise the generated one is used.
            id: this.targetId(this.generatedId),
            delay: this.delay,
            closeDelay: this.closeDelay,
            disabled: this.disabled,
            primary: this.primary ?? false
        };
    }
}
