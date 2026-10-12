import { mergeProps } from '@flippo-software/core-components/props';
import { ScrollAreaMachine } from '@flippo-software/core-components/scroll-area';

import type { Props } from '@flippo-software/core-components/props';
import type { OverflowEdgeThreshold } from '@flippo-software/core-components/scroll-area';

import { declareProvider, provideContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { MachineElement } from '../../../lib/MachineElement';

import { ScrollAreaContext } from './ScrollAreaRootContext';

/**
 * A scrollable area with custom scrollbars (the native ones are hidden): the root of the `-scroll-area-*` parts.
 *
 * Attributes: `overflow-edge-threshold` (px from an edge under which it counts as reached).
 * State attributes (on all parts): `data-scrolling`, `data-has-overflow-x`/`-y`, `data-overflow-x-start`/`-end`,
 * `data-overflow-y-start`/`-end`.
 */
export class ScrollAreaElement extends MachineElement.withAttributes({
    'overflow-edge-threshold': 'number'
}) {
    private scrollArea!: ScrollAreaMachine;

    private readonly generatedId = createId('scroll-area');

    constructor() {
        super();
        declareProvider(this, ScrollAreaContext);
    }

    get machine(): ScrollAreaMachine {
        return this.scrollArea;
    }

    protected override createParts() {
        this.scrollArea = new ScrollAreaMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.scrollArea.setOptions(this.getOptions());
    }

    protected override connectParts() {
        const disconnect = this.scrollArea.connect();
        const stopProviding = provideContext(this, ScrollAreaContext, this);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.scrollArea?.setRoot(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.scrollArea.getRootProps(), ScrollAreaMachine.attrs(this.scrollArea.getState()));
    }

    private getOptions() {
        return {
            overflowEdgeThreshold: this.overflowEdgeThreshold as OverflowEdgeThreshold | undefined,
            direction: this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? ('rtl' as const) : ('ltr' as const),
            rootId: this.targetId(this.generatedId)
        };
    }
}
