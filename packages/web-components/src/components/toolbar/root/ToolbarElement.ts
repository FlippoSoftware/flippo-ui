import { mergeProps } from '@flippo-software/core-components/props';
import { ToolbarMachine } from '@flippo-software/core-components/toolbar';

import type { Props } from '@flippo-software/core-components/props';
import type { ToolbarOptions } from '@flippo-software/core-components/toolbar';

import { declareProvider, provideContext } from '../../../lib/context';
import { MachineElement } from '../../../lib/MachineElement';

import { ToolbarContext } from './ToolbarRootContext';

/**
 * A row of controls; the arrow keys move between them, and Tab moves past the toolbar: the root of the
 * `-toolbar-*` parts. Other components go in it with `as-child`: `<ui-toolbar-button as-child><ui-toggle as-child>
 * <button>…`.
 *
 * Attributes: `disabled`, `orientation` (`horizontal` by default, `vertical`), `loop-focus` (`"false"` stops at the
 * ends), `cols`.
 * State attributes: `data-disabled`, `data-orientation`.
 */
export class ToolbarElement extends MachineElement.withAttributes({
    disabled: 'boolean',
    orientation: ['horizontal', 'vertical'],
    'loop-focus': 'boolean',
    cols: 'number'
}) {
    private toolbar!: ToolbarMachine;

    constructor() {
        super();
        declareProvider(this, ToolbarContext);
    }

    get machine(): ToolbarMachine {
        return this.toolbar;
    }

    protected override createParts() {
        this.toolbar = new ToolbarMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.toolbar.setOptions(this.getOptions());
    }

    protected override connectParts() {
        const disconnect = this.toolbar.connect();
        const stopProviding = provideContext(this, ToolbarContext, this);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.toolbar?.composite.setRoot(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.toolbar.getRootProps(), ToolbarMachine.attrs(this.toolbar.getState()));
    }

    private getOptions(): ToolbarOptions {
        return {
            disabled: this.disabled ?? false,
            orientation: this.orientation ?? 'horizontal',
            loopFocus: this.loopFocus ?? true,
            cols: this.cols ?? 1,
            direction: this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr'
        };
    }
}
