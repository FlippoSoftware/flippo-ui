import { getStyleHookProps } from '~@attributes/getStyleHookProps';
import { OpenChangeComplete } from '~@dom/OpenChangeComplete';
import { TransitionStatusController } from '~@dom/TransitionStatusController';
import { Connectable } from '~@lib/Connectable';
import { mergeProps } from '~@props/mergeProps';

import type { MutableRef, TransitionStatus } from '~@lib/types';
import type { Props } from '~@props/mergeProps';

import { menuItemCheckedMapping } from '../item/menuItemCheckedMapping';

import type { MenuCheckableItemState } from '../checkbox-item/MenuCheckboxItemMachine';

export type MenuItemIndicatorState = MenuCheckableItemState & {
    transitionStatus: TransitionStatus;
};

/**
 * `Menu.CheckboxItemIndicator` / `Menu.RadioItemIndicator`: transition status while checked.
 * The adapter renders it when `keepMounted || checked`.
 */
export class MenuItemIndicatorMachine extends Connectable {
    readonly transitions: TransitionStatusController;

    readonly ref: MutableRef<HTMLElement | null> = { current: null };

    private checked: boolean;

    private readonly openChangeComplete: OpenChangeComplete;

    constructor(checked: boolean) {
        super();
        this.checked = checked;
        this.transitions = new TransitionStatusController(checked);
        this.openChangeComplete = new OpenChangeComplete(this.ref, () => {
            if (!this.checked) {
                this.transitions.setMounted(false);
            }
        });
        this.openChangeComplete.sync(checked);
    }

    protected override onConnect() {
        this.connectChild(this.transitions);
    }

    setChecked(checked: boolean) {
        this.checked = checked;
        this.transitions.setOpen(checked);
        this.openChangeComplete.sync(checked);
    }

    setElement = (element: HTMLElement | null) => {
        this.ref.current = element;
    };

    shouldRender(keepMounted = false): boolean {
        return keepMounted || this.checked;
    }

    getState(item: MenuCheckableItemState): MenuItemIndicatorState {
        return { ...item, transitionStatus: this.transitions.state.transitionStatus };
    }

    static attrs(state: MenuItemIndicatorState) {
        return getStyleHookProps(state, menuItemCheckedMapping);
    }

    getProps(elementProps: Props = {}): Props {
        return mergeProps({ 'aria-hidden': true }, elementProps);
    }

    protected override onDisconnect() {
        this.openChangeComplete.destroy();
    }
}
