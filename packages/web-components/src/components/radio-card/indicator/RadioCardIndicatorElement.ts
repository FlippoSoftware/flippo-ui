import { MenuItemIndicatorMachine } from '@flippo-software/core-components/menu';
import { mergeProps } from '@flippo-software/core-components/props';
import { RadioCardMachine } from '@flippo-software/core-components/radio-card';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { RADIO_CARD } from '../root/RadioCardRootContext';

abstract class RadioCardPart extends ContextPart<typeof RADIO_CARD> {
    protected readonly contexts = RADIO_CARD;
}

/**
 * Shows whether the card is checked: hidden while unchecked (unless `keep-mounted`).
 *
 * Attributes: `keep-mounted`.
 * State attributes: those of the card, and transition attributes.
 */
export class RadioCardIndicatorElement extends RadioCardPart.withAttributes({
    /**
     * Whether to keep the element in the DOM when the card is not selected.
     * @default false
     */
    'keep-mounted': 'boolean'
}) {
    private indicator!: MenuItemIndicatorMachine;

    private get radio(): RadioCardMachine {
        return this.provided[0].machine;
    }

    protected override createParts() {
        this.indicator = new MenuItemIndicatorMachine(untracked(() => this.radio.checked));
    }

    protected override applyOptions() {}

    protected override connectParts() {
        const disconnect = this.indicator.connect();
        const stop = effect(() => {
            const { checked } = this.radio;
            untracked(() => this.indicator.setChecked(checked));
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
        const state = { ...this.radio.getState(), transitionStatus: this.indicator.transitions.state.transitionStatus };
        return mergeProps({ hidden: !this.indicator.shouldRender(this.keepMounted ?? false) }, RadioCardMachine.attrs(state));
    }
}
