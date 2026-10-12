import { mergeProps } from '@flippo-software/core-components/props';
import { ToggleGroupMachine } from '@flippo-software/core-components/toggle-group';

import type { Props } from '@flippo-software/core-components/props';
import type { ToggleGroupChangeEventDetails, ToggleGroupOptions } from '@flippo-software/core-components/toggle-group';

import { declareProvider, provideContext, requestAncestorContext } from '../../../lib/context';
import { MachineElement, property } from '../../../lib/MachineElement';
import { ToolbarElement } from '../../toolbar/root/ToolbarElement';
import { ToolbarContext } from '../../toolbar/root/ToolbarRootContext';

import { ToggleGroupContext, type ToggleGroupValueChangeDetail } from './ToggleGroupRootContext';

const WHITESPACE = /\s+/;

/**
 * Toggles sharing one value: the values of the pressed ones (one at most, unless `multiple`). The arrow keys move
 * between them (in a toolbar, the toolbar's do).
 *
 * Attributes: `disabled`, `multiple`, `orientation` (`horizontal` by default, `vertical`), `loop-focus` (`"false"`
 * stops at the ends), `default-value` (space-separated values).
 * Properties: `value` (controlled; an array), `defaultValue` (an array).
 * Events: `value-change` (cancelable; `detail: { value, reason }`).
 * State attributes: `data-disabled`, `data-multiple`, `data-orientation`.
 */
export class ToggleGroupElement extends MachineElement.withAttributes({
    disabled: 'boolean',
    multiple: 'boolean',
    orientation: ['horizontal', 'vertical'],
    'loop-focus': 'boolean',
    'default-value': 'string',
    value: property<readonly string[]>()
}) {
    private group!: ToggleGroupMachine;

    private toolbar: ToolbarElement | undefined;

    private cancelRequest: (() => void) | null = null;

    constructor() {
        super();
        declareProvider(this, ToggleGroupContext);
    }

    get machine(): ToggleGroupMachine {
        return this.group;
    }

    protected override whenReady(callback: () => void) {
        this.cancelRequest?.();
        this.cancelRequest = requestAncestorContext(this, ToolbarContext, ToolbarElement, (toolbar) => {
            this.cancelRequest = null;
            this.toolbar = toolbar;
            callback();
        });
    }

    override disconnectedCallback() {
        this.cancelRequest?.();
        this.cancelRequest = null;
        super.disconnectedCallback();
    }

    protected override createParts() {
        this.group = new ToggleGroupMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.group.setOptions(this.getOptions());
    }

    protected override connectParts() {
        const disconnect = this.group.connect();
        const stopProviding = provideContext(this, ToggleGroupContext, this);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        // In a toolbar, the toolbar moves the focus.
        if (!this.toolbar) {
            this.group?.composite.setRoot(element);
        }
    }

    protected override getProps(): Props {
        return mergeProps(this.group.getRootProps(), ToggleGroupMachine.rootAttrs(this.group.getState()));
    }

    private getOptions(): ToggleGroupOptions {
        const defaultValue = this.defaultValue?.split(WHITESPACE).filter(Boolean);
        return {
            value: this.value,
            defaultValue,
            disabled: this.disabled ?? false,
            multiple: this.multiple ?? false,
            orientation: this.orientation ?? 'horizontal',
            loopFocus: this.loopFocus ?? true,
            inToolbar: this.toolbar !== undefined,
            toolbarDisabled: this.toolbar?.machine.disabled,
            direction: this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr',
            onValueChange: (value: string[], eventDetails: ToggleGroupChangeEventDetails) => {
                this.emit('value-change', { value, reason: eventDetails.reason } satisfies ToggleGroupValueChangeDetail, eventDetails);
            }
        };
    }
}
