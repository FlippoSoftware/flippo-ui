import { FOCUSABLE_ATTRIBUTE } from '@flippo-software/core-components/floating';
import { MenuPopupMachine } from '@flippo-software/core-components/menu';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { MenuPositionedPart } from '../root/MenuRootContext';

/**
 * The container of the menu's items.
 *
 * State attributes: `data-open`/`data-closed`, `data-side`, `data-align`, `data-nested`, `data-instant`, transition
 * attributes.
 */
export class MenuPopupElement extends MenuPositionedPart.withAttributes({}) {
    private popup!: MenuPopupMachine;

    protected override createParts() {
        // No portal: the popup stays in place, in the top layer.
        this.popup = new MenuPopupMachine(this.root, { positioner: this.positionerElement.machine, portal: null });
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
        return mergeProps(this.popup.getPopupProps(), MenuPopupMachine.attrs(this.popup.getState()));
    }
}
