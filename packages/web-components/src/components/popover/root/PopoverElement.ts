import { PopoverRootMachine } from '@flippo-software/core-components/popover';

import type { PopoverChangeEventDetails, PopoverRootOptions } from '@flippo-software/core-components/popover';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext, requestAncestorContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { MachineElement } from '../../../lib/MachineElement';

import { PopoverContext, type PopoverOpenChangeDetail } from './PopoverRootContext';

/**
 * `modal` (present) → `true`, `modal="trap-focus"` → focus trap only. Frameworks may set the property to a boolean.
 */
function toModalOption(value: unknown): PopoverRootOptions['modal'] {
    if (value === 'trap-focus') {
        return 'trap-focus';
    }
    return value !== undefined && value !== false && value !== 'false';
}

/**
 * A popup anchored to a trigger: the root of the `-popover-*` parts.
 *
 * Attributes: `open` (controlled), `default-open`, `modal` (`modal`: the page is inert and does not scroll, and a
 * press outside only closes the popover; `modal="trap-focus"`: only the focus is trapped in the popup).
 * Events: `open-change` (cancelable; `detail: { open, reason }`), `open-change-complete` (`detail: { open }`).
 *
 * The popup is shown in the top layer (Popover API): it stays where it is in the document, above everything else.
 * Place it after the trigger, so that Tab moves from the trigger into the popup. A popover inside the popup of
 * another one is nested: pressing inside it does not close the parent.
 */
export class PopoverElement extends MachineElement.withAttributes({
    open: 'boolean',
    'default-open': 'boolean',
    modal: 'string'
}) {
    private rootMachine!: PopoverRootMachine;

    private backdrop: HTMLDivElement | null = null;

    /**
     * The popover this one is nested in, if any.
     */
    private parentRoot: PopoverElement | undefined;

    private cancelParentRequest: (() => void) | null = null;

    constructor() {
        super();
        // Its parts are its own, even while it waits for a parent popover.
        declareProvider(this, PopoverContext);
    }

    /**
     * The machine of the popover.
     */
    get machine(): PopoverRootMachine {
        return this.rootMachine;
    }

    /**
     * The internal backdrop of modal popovers, in the shadow root: it blocks the page under the popup and closes it
     * when pressed. Outside of the positioner, which is the floating element: a press on it is outside.
     */
    get internalBackdrop(): HTMLDivElement {
        if (!this.backdrop) {
            const root = this.shadowRoot ?? this.attachShadow({ mode: 'open' });
            this.backdrop = this.ownerDocument.createElement('div');
            if (!root.querySelector('slot')) {
                root.append(this.ownerDocument.createElement('slot'));
            }
            root.prepend(this.backdrop);
        }
        return this.backdrop;
    }

    /**
     * Waits for the popover this one is nested in, if any (it may connect after its children).
     */
    protected override whenReady(callback: () => void) {
        this.cancelParentRequest?.();
        this.cancelParentRequest = requestAncestorContext(this, PopoverContext, PopoverElement, (parent) => {
            this.cancelParentRequest = null;
            this.parentRoot = parent;
            callback();
        });
    }

    override disconnectedCallback() {
        this.cancelParentRequest?.();
        this.cancelParentRequest = null;
        super.disconnectedCallback();
    }

    protected override createParts() {
        // Nested in the popup of another popover: share its floating tree.
        this.rootMachine = new PopoverRootMachine(this.getOptions(), {
            fallbackReferenceId: createId('popover-reference'),
            floatingId: createId('popover-popup'),
            tree: this.parentRoot?.machine.tree ?? null,
            nested: this.parentRoot !== undefined
        });
    }

    protected override applyOptions() {
        this.rootMachine.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.rootMachine.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.rootMachine.connect();
        const stopProviding = provideContext(this, PopoverContext, this);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override getProps(): Props {
        return {};
    }

    private getOptions(): PopoverRootOptions {
        return {
            open: this.open,
            defaultOpen: this.defaultOpen ?? false,
            modal: toModalOption(this.modal),
            onOpenChange: (open: boolean, eventDetails: PopoverChangeEventDetails) => {
                this.emit('open-change', { open, reason: eventDetails.reason } satisfies PopoverOpenChangeDetail, eventDetails);
            },
            onOpenChangeComplete: (open: boolean) => {
                this.emit('open-change-complete', { open });
            }
        };
    }
}
