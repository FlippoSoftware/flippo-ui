import { MenuRootMachine } from '@flippo-software/core-components/menu';
import { Store } from '@flippo-software/store';

import type { MenuChangeEventDetails, MenuParent, MenuRootOptions, MenuRootSetup } from '@flippo-software/core-components/menu';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext, requestAncestorContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { MachineElement } from '../../../lib/MachineElement';
import { MenubarElement } from '../../menubar/root/MenubarElement';
import { MenubarContext } from '../../menubar/root/MenubarRootContext';

import { MenuContext, type MenuOpenChangeDetail, type MenuRootDriver } from './MenuRootContext';

/**
 * A list of actions in a popup opened by a button: the root of the `-menu-*` parts.
 *
 * Attributes: `open` (controlled), `default-open`, `disabled`, `modal` (modal by default: the page does not scroll and
 * a press outside only closes the menu; `modal="false"` leaves the page usable), `loop-focus` (`"false"` stops the
 * arrow keys at the ends of the list), `orientation` (`vertical`, `horizontal`), `highlight-item-on-hover`
 * (`"false"`: only the keyboard highlights items), `close-parent-on-esc` (submenus; `"false"`: Escape closes only the
 * submenu).
 * Events: `open-change` (cancelable; `detail: { open, reason }`), `open-change-complete` (`detail: { open }`).
 *
 * The positioner is shown in the top layer (Popover API): it stays where it is in the document. Place it after the
 * trigger, so that Tab moves from the trigger into the menu.
 */
export class MenuElement extends MachineElement.withAttributes({
    open: 'boolean',
    'default-open': 'boolean',
    disabled: 'boolean',
    modal: 'boolean',
    'loop-focus': 'boolean',
    orientation: ['vertical', 'horizontal'],
    'highlight-item-on-hover': 'boolean',
    'close-parent-on-esc': 'boolean'
}) {
    /**
     * The parts registered by the children (the backdrop), in a store so that the positioner follows them.
     */
    readonly parts = new Store<{ backdrop: HTMLElement | null }>({ backdrop: null });

    private rootMachine!: MenuRootMachine;

    private driver!: MenuRootDriver;

    private menubar: MenubarElement | undefined;

    private cancelMenubarRequest: (() => void) | null = null;

    private backdrop: HTMLDivElement | null = null;

    constructor() {
        super();
        declareProvider(this, MenuContext);
    }

    /**
     * The machine of the menu.
     */
    get machine(): MenuRootMachine {
        return this.rootMachine;
    }

    /**
     * The internal backdrop of modal menus, in the shadow root, outside of the positioner (the floating element): a
     * press on it is outside.
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
     * The menubar the menu is in, if any.
     */
    get menubarElement(): MenubarElement | undefined {
        return this.menubar;
    }

    /**
     * Waits for the menubar around it, if any.
     */
    protected override whenReady(callback: () => void) {
        this.cancelMenubarRequest?.();
        this.cancelMenubarRequest = requestAncestorContext(this, MenubarContext, MenubarElement, (menubar) => {
            this.cancelMenubarRequest = null;
            this.menubar = menubar;
            callback();
        });
    }

    override disconnectedCallback() {
        this.cancelMenubarRequest?.();
        this.cancelMenubarRequest = null;
        super.disconnectedCallback();
    }

    /**
     * What the menu is nested in: a menubar, or nothing (a submenu: its parent menu).
     */
    protected getParent(): MenuParent {
        return this.menubar ? { type: 'menubar', context: this.menubar.machine.context } : { type: undefined };
    }

    /**
     * Whether the menu is nested (in a menu, a menubar or a context menu): its modality is the parent's.
     */
    protected isNested(): boolean {
        return this.getParent().type !== undefined;
    }

    /**
     * Creates the machine of the menu, and the machine the element drives (the same one, or e.g. the context menu
     * around it).
     */
    protected createRoot(options: MenuRootOptions, setup: MenuRootSetup<unknown>): { menu: MenuRootMachine; owner: MenuRootDriver } {
        const menu = new MenuRootMachine(options, { ...setup, parent: this.getParent() });
        return { menu, owner: menu };
    }

    protected override createParts() {
        const { menu, owner } = this.createRoot(this.getOptions(), {
            rootId: createId('menu'),
            fallbackReferenceId: createId('menu-reference'),
            nodeId: createId('menu-node'),
            floatingId: createId('menu-popup'),
            direction: this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr'
        });
        this.rootMachine = menu;
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
        const stopProviding = provideContext(this, MenuContext, this);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override getProps(): Props {
        return {};
    }

    private getOptions(): MenuRootOptions {
        const nested = this.isNested();
        return {
            open: this.open,
            defaultOpen: this.defaultOpen ?? false,
            disabled: this.disabled ?? false,
            // Submenus follow the modality of their root.
            modal: nested ? undefined : (this.modal ?? true),
            loopFocus: this.loopFocus ?? true,
            orientation: this.orientation ?? 'vertical',
            highlightItemOnHover: this.highlightItemOnHover ?? true,
            closeParentOnEsc: this.closeParentOnEsc ?? true,
            onOpenChange: (open: boolean, eventDetails: MenuChangeEventDetails) => {
                this.emit('open-change', { open, reason: eventDetails.reason } satisfies MenuOpenChangeDetail, eventDetails);
            },
            onOpenChangeComplete: (open: boolean) => {
                this.emit('open-change-complete', { open });
            }
        };
    }
}
