import { FOCUSABLE_ATTRIBUTE } from '@flippo-software/core-components/floating';
import { PopoverPopupMachine } from '@flippo-software/core-components/popover';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { PopoverPositionedPart } from '../root/PopoverRootContext';

/**
 * The container of the popover's content: a dialog with focus management and dismissal.
 *
 * State attributes: `data-open`/`data-closed`, `data-side`, `data-align`, `data-instant`, transition attributes.
 */
export class PopoverPopupElement extends PopoverPositionedPart.withAttributes({}) {
    private popup!: PopoverPopupMachine;

    protected override createParts() {
        this.popup = new PopoverPopupMachine(this.root.store, {
            positioner: this.positioner,
            tree: this.root.tree,
            direction: this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr',
            // No portal: the popup stays in place, in the top layer.
            portal: null
        });
    }

    protected override applyOptions() {
        this.popup.setOptions({});
    }

    protected override afterOptions() {
        this.popup.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.popup.connect();
        // The focus manager exists once the popup is connected; the guards are in the positioner's shadow root.
        const detachGuards = this.positionerElement.attachFocusGuards(this.popup.focusManager);
        return () => {
            detachGuards();
            disconnect();
        };
    }

    /**
     * Marks the popup right away, before its parts wait for the contexts: the positioner finds its popup by this
     * attribute (its first descendant with it), and must not take the popup of a nested menu or popover for its own.
     */
    override connectedCallback() {
        (this.asChild ? this.firstElementChild : this)?.setAttribute(FOCUSABLE_ATTRIBUTE, '');
        super.connectedCallback();
    }

    protected override onTargetChange(element: HTMLElement | null) {
        element?.setAttribute(FOCUSABLE_ATTRIBUTE, '');
        this.popup?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.popup.getPopupProps(), PopoverPopupMachine.attrs(this.popup.getState()));
    }
}
