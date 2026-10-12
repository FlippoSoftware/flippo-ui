import { DialogRootMachine } from '@flippo-software/core-components/dialog';
import { Store } from '@flippo-software/store';

import type { DialogChangeEventDetails, DialogRootOptions, DialogRootSetup } from '@flippo-software/core-components/dialog';
import type { FocusManager } from '@flippo-software/core-components/floating';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext, requestAncestorContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { FocusGuards } from '../../../lib/FocusGuards';
import { MachineElement } from '../../../lib/MachineElement';

import { DialogContext, type DialogOpenChangeDetail, type DialogRootDriver } from './DialogRootContext';

/**
 * Dialogs are modal by default: the `modal` attribute turns it off with `modal="false"`, or traps only the focus with
 * `modal="trap-focus"`. Frameworks may set the property to a boolean.
 */
function toModalOption(value: unknown): DialogRootOptions['modal'] {
    if (value === 'trap-focus') {
        return 'trap-focus';
    }
    return value !== false && value !== 'false';
}

/**
 * A window above the page: the root of the `-dialog-*` parts.
 *
 * Attributes: `open` (controlled), `default-open`, `modal` (modal by default: the page is inert and does not scroll and
 * the focus is trapped; `modal="false"`; `modal="trap-focus"`: only the focus is trapped), `disable-pointer-dismissal`.
 * Events: `open-change` (cancelable; `detail: { open, reason }`), `open-change-complete` (`detail: { open }`).
 *
 * The popup and the backdrop are shown in the top layer (Popover API), centered by the browser unless styled. A dialog
 * inside the popup of another one is nested.
 */
export class DialogElement extends MachineElement.withAttributes({
    open: 'boolean',
    'default-open': 'boolean',
    modal: 'string',
    'disable-pointer-dismissal': 'boolean'
}) {
    /**
     * The parts registered by the children (the backdrop), in a store so that the popup follows them.
     */
    readonly parts = new Store<{ backdrop: HTMLElement | null; forceRenderBackdrop: boolean }>({
        backdrop: null,
        forceRenderBackdrop: false
    });

    private rootMachine!: DialogRootMachine;

    private driver!: DialogRootDriver;

    private readonly shadow = this.attachShadow({ mode: 'open' });

    /**
     * Focus guards around the content, in the shadow root: outside of the popup, so that the focus manager does not
     * take them for its content.
     */
    private readonly focusGuards = new FocusGuards(this.shadow);

    private backdrop: HTMLDivElement | null = null;

    /**
     * The dialog this one is nested in, if any.
     */
    private parentRoot: DialogElement | undefined;

    private cancelParentRequest: (() => void) | null = null;

    constructor() {
        super();
        // Its parts are its own, even while it waits for a parent dialog.
        declareProvider(this, DialogContext);
    }

    get machine(): DialogRootMachine {
        return this.rootMachine;
    }

    /**
     * The internal backdrop of modal dialogs, in the shadow root, outside of the popup: a press on it is outside.
     */
    get internalBackdrop(): HTMLDivElement {
        if (!this.backdrop) {
            this.backdrop = this.ownerDocument.createElement('div');
            this.shadow.prepend(this.backdrop);
        }
        return this.backdrop;
    }

    /**
     * Lets the focus manager of the popup use the focus guards. Returns a function that detaches it.
     */
    attachFocusGuards(focusManager: FocusManager): () => void {
        return this.focusGuards.attach(focusManager);
    }

    /**
     * Waits for the dialog this one is nested in, if any (it may connect after its children).
     */
    protected override whenReady(callback: () => void) {
        this.cancelParentRequest?.();
        this.cancelParentRequest = requestAncestorContext(this, DialogContext, DialogElement, (parent) => {
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

    /**
     * Creates the machine of the dialog, and the machine the element drives (the same one, or e.g. the drawer around
     * it).
     */
    protected createRoot(
        options: DialogRootOptions,
        setup: DialogRootSetup<unknown>
    ): { dialog: DialogRootMachine; owner: DialogRootDriver } {
        const dialog = new DialogRootMachine(options, setup);
        return { dialog, owner: dialog };
    }

    protected override createParts() {
        const { dialog, owner } = this.createRoot(this.getOptions(), {
            parentStore: this.parentRoot?.machine.store ?? null,
            fallbackReferenceId: createId('dialog-reference'),
            floatingId: createId('dialog-popup')
        });
        this.rootMachine = dialog;
        this.driver = owner;
    }

    protected override applyOptions() {
        this.driver.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.driver.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.driver.connect();
        const stopProviding = provideContext(this, DialogContext, this);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override getProps(): Props {
        return {};
    }

    /**
     * The options of the root machine (subclasses add theirs).
     */
    protected getOptions(): DialogRootOptions {
        return {
            open: this.open,
            defaultOpen: this.defaultOpen ?? false,
            modal: toModalOption(this.modal),
            disablePointerDismissal: this.disablePointerDismissal ?? false,
            onOpenChange: (open: boolean, eventDetails: DialogChangeEventDetails) => {
                this.emit('open-change', { open, reason: eventDetails.reason } satisfies DialogOpenChangeDetail, eventDetails);
            },
            onOpenChangeComplete: (open: boolean) => {
                this.emit('open-change-complete', { open });
            }
        };
    }
}
