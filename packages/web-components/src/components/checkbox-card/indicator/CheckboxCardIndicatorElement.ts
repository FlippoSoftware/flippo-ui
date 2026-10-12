import { CheckboxCardMachine } from '@flippo-software/core-components/checkbox-card';
import { MenuItemIndicatorMachine } from '@flippo-software/core-components/menu';
import { mergeProps } from '@flippo-software/core-components/props';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { CHECKBOX_CARD_CARD } from '../root/CheckboxCardRootContext';

abstract class CheckboxCardPart extends ContextPart<typeof CHECKBOX_CARD_CARD> {
    protected readonly contexts = CHECKBOX_CARD_CARD;
}

/**
 * Shows whether the card is checked: hidden while unchecked (unless `keep-mounted`).
 *
 * Attributes: `keep-mounted`.
 * State attributes: those of the card, and transition attributes.
 */
export class CheckboxCardIndicatorElement extends CheckboxCardPart.withAttributes({
    'keep-mounted': 'boolean'
}) {
    private indicator!: MenuItemIndicatorMachine;

    private get card(): CheckboxCardMachine {
        return this.provided[0].machine;
    }

    private get rendered(): boolean {
        const { checked, indeterminate } = this.card.getState();
        return checked || indeterminate;
    }

    protected override createParts() {
        this.indicator = new MenuItemIndicatorMachine(untracked(() => this.rendered));
    }

    protected override applyOptions() {}

    protected override connectParts() {
        const disconnect = this.indicator.connect();
        const stop = effect(() => {
            const { rendered } = this;
            untracked(() => this.indicator.setChecked(rendered));
        });
        return () => {
            stop();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.indicator?.setElement(element);
    }

    protected override getProps(): Props {
        const state = { ...this.card.getState(), transitionStatus: this.indicator.transitions.state.transitionStatus };
        return mergeProps({ hidden: !this.indicator.shouldRender(this.keepMounted ?? false) }, CheckboxCardMachine.attrs(state));
    }
}
