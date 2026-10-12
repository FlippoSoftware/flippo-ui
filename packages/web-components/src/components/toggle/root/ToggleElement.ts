import { ButtonMachine } from '@flippo-software/core-components/button';
import { mergeProps } from '@flippo-software/core-components/props';
import { ToggleMachine } from '@flippo-software/core-components/toggle';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';
import type { ToggleChangeEventDetails, ToggleOptions } from '@flippo-software/core-components/toggle';

import { requestAncestorContext } from '../../../lib/context';
import { MachineElement } from '../../../lib/MachineElement';
import { ToggleGroupElement } from '../../toggle-group/root/ToggleGroupElement';
import { ToggleGroupContext } from '../../toggle-group/root/ToggleGroupRootContext';

import type { TogglePressedChangeDetail } from './ToggleRootContext';

/**
 * A two-state button that can be on or off. In a toggle group, its `value` is in the group's value while pressed, and
 * the arrow keys move between the toggles.
 *
 * Attributes: `pressed` (controlled), `default-pressed`, `disabled`, `value`.
 * Events: `pressed-change` (cancelable; `detail: { pressed, reason }`).
 * State attributes: `data-pressed`, `data-disabled`.
 */
export class ToggleElement extends MachineElement.withAttributes({
    pressed: 'boolean',
    'default-pressed': 'boolean',
    disabled: 'boolean',
    value: 'string'
}) {
    private toggle!: ToggleMachine;

    private button!: ButtonMachine;

    private group: ToggleGroupElement | undefined;

    private cancelGroupRequest: (() => void) | null = null;

    /**
     * Waits for the toggle group around it, if any.
     */
    protected override whenReady(callback: () => void) {
        this.cancelGroupRequest?.();
        this.cancelGroupRequest = requestAncestorContext(this, ToggleGroupContext, ToggleGroupElement, (group) => {
            this.cancelGroupRequest = null;
            this.group = group;
            callback();
        });
    }

    override disconnectedCallback() {
        this.cancelGroupRequest?.();
        this.cancelGroupRequest = null;
        super.disconnectedCallback();
    }

    protected override createParts() {
        this.toggle = new ToggleMachine(this.getToggleOptions());
        this.button = new ButtonMachine(this.getButtonOptions());
    }

    protected override applyOptions() {
        this.toggle.setOptions(this.getToggleOptions());
        this.button.setOptions(this.getButtonOptions());
    }

    protected override connectParts() {
        const disconnect = this.toggle.connect();
        // The pressed state of a grouped toggle follows the group's value.
        const stopFollowing = effect(() => {
            const group = this.group?.machine;
            if (group) {
                group.value;
                group.getState();
                untracked(() => this.flushOptions());
            }
        });
        return () => {
            stopFollowing();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.toggle.setElement(element);
        this.button.setElement(element);
    }

    protected override getProps(): Props {
        const state = this.toggle.getState();
        return mergeProps(this.button.getButtonProps(this.toggle.getRootProps()), ToggleMachine.rootAttrs(state));
    }

    private getToggleOptions(): ToggleOptions {
        const group = this.group?.machine;
        const value = this.value ?? '';
        return {
            pressed: group && value ? group.value.includes(value) : this.pressed,
            defaultPressed: group ? undefined : (this.defaultPressed ?? false),
            disabled: (this.disabled ?? false) || (group?.getState().disabled ?? false),
            value,
            group: group ?? null,
            onPressedChange: (pressed: boolean, eventDetails: ToggleChangeEventDetails) => {
                group?.setGroupValue(value, pressed, eventDetails);
                this.emit('pressed-change', { pressed, reason: eventDetails.reason } satisfies TogglePressedChangeDetail, eventDetails);
            }
        };
    }

    private getButtonOptions() {
        return {
            disabled: (this.disabled ?? false) || (this.group?.machine.getState().disabled ?? false),
            native: this.target?.localName === 'button',
            composite: this.group !== undefined
        };
    }
}
