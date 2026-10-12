import { MenuItemIndicatorMachine } from '@flippo-software/core-components/menu';
import { mergeProps } from '@flippo-software/core-components/props';
import { RadioMachine } from '@flippo-software/core-components/radio';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { RADIO } from '../root/RadioRootContext';

abstract class RadioPart extends ContextPart<typeof RADIO> {
    protected readonly contexts = RADIO;
}

/**
 * Shows whether the radio is checked: hidden while unchecked (unless `keep-mounted`).
 *
 * Attributes: `keep-mounted`.
 * State attributes: those of the radio, and transition attributes.
 */
export class RadioIndicatorElement extends RadioPart.withAttributes({
    'keep-mounted': 'boolean'
}) {
    private indicator!: MenuItemIndicatorMachine;

    private get radio(): RadioMachine {
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
        return mergeProps({ hidden: !this.indicator.shouldRender(this.keepMounted ?? false) }, RadioMachine.attrs(state));
    }
}
