import { CheckboxMachine } from '@flippo-software/core-components/checkbox';
import { MenuItemIndicatorMachine } from '@flippo-software/core-components/menu';
import { mergeProps } from '@flippo-software/core-components/props';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { CHECKBOX } from '../root/CheckboxRootContext';

abstract class CheckboxPart extends ContextPart<typeof CHECKBOX> {
    protected readonly contexts = CHECKBOX;
}

/**
 * Shows whether the checkbox is checked: hidden while unchecked (unless `keep-mounted`).
 *
 * Attributes: `keep-mounted`.
 * State attributes: those of the checkbox, and transition attributes.
 */
export class CheckboxIndicatorElement extends CheckboxPart.withAttributes({
    /**
     * Whether to keep the element in the DOM when the checkbox is not checked.
     * @default false
     */
    'keep-mounted': 'boolean'
}) {
    private indicator!: MenuItemIndicatorMachine;

    private get checkbox(): CheckboxMachine {
        return this.provided[0].machine;
    }

    protected override createParts() {
        this.indicator = new MenuItemIndicatorMachine(untracked(() => CheckboxMachine.isIndicatorRendered(this.checkbox.getState())));
    }

    protected override applyOptions() {}

    protected override connectParts() {
        const disconnect = this.indicator.connect();
        const stop = effect(() => {
            const rendered = CheckboxMachine.isIndicatorRendered(this.checkbox.getState());
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
        const state = { ...this.checkbox.getState(), transitionStatus: this.indicator.transitions.state.transitionStatus };
        return mergeProps({ hidden: !this.indicator.shouldRender(this.keepMounted ?? false) }, CheckboxMachine.indicatorAttrs(state));
    }
}
