import { mergeProps } from '@flippo-software/core-components/props';
import { TooltipPositionerMachine } from '@flippo-software/core-components/tooltip';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { prepareTopLayer, releaseTopLayer, showInTopLayer } from '../../../lib/topLayer';
import { TooltipPart, TooltipPositionerContext } from '../root/TooltipRootContext';

/**
 * Positions the popup against the trigger, in the top layer while the tooltip is mounted.
 *
 * Attributes: like the popover positioner (`side` defaults to `top`).
 * State attributes: `data-open`/`data-closed`, `data-side`, `data-align`, `data-anchor-hidden`.
 */
export class TooltipPositionerElement extends TooltipPart.withAttributes({
    side: ['top', 'bottom', 'left', 'right', 'inline-start', 'inline-end'],
    align: ['start', 'center', 'end'],
    'side-offset': 'number',
    'align-offset': 'number',
    'collision-padding': 'number',
    'arrow-padding': 'number',
    sticky: 'boolean',
    'position-method': ['fixed', 'absolute'],
    'keep-mounted': 'boolean',
    'disable-anchor-tracking': 'boolean'
}) {
    private positionerMachine!: TooltipPositionerMachine;

    constructor() {
        super();
        declareProvider(this, TooltipPositionerContext);
    }

    get machine(): TooltipPositionerMachine {
        return this.positionerMachine;
    }

    protected override createParts() {
        this.positionerMachine = new TooltipPositionerMachine(this.root, this.getOptions());
    }

    protected override applyOptions() {
        this.positionerMachine.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.positionerMachine.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.positionerMachine.connect();
        const stopProviding = provideContext(this, TooltipPositionerContext, this);
        // In the top layer while mounted, before the props remove `hidden`.
        const stopShowing = effect(() => {
            const mounted = this.root.store.select('mounted');
            untracked(() => this.showTarget(mounted));
        });
        return () => {
            stopShowing();
            this.showTarget(false);
            stopProviding();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.positionerMachine?.setElement(element);
        if (element) {
            prepareTopLayer(element);
            this.showTarget(this.root.store.select('mounted'));
        }
    }

    protected override onTargetRelease(element: HTMLElement) {
        releaseTopLayer(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.positionerMachine.getPositionerProps(), TooltipPositionerMachine.attrs(this.positionerMachine.getState()));
    }

    private showTarget(shown: boolean) {
        const element = this.target;
        if (element) {
            showInTopLayer(element, shown);
        }
    }

    private getOptions() {
        return {
            side: this.side,
            align: this.align,
            sideOffset: this.sideOffset,
            alignOffset: this.alignOffset,
            collisionPadding: this.collisionPadding,
            arrowPadding: this.arrowPadding,
            sticky: this.sticky,
            positionMethod: this.positionMethod ?? 'fixed',
            keepMounted: this.keepMounted,
            disableAnchorTracking: this.disableAnchorTracking,
            direction: this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? ('rtl' as const) : ('ltr' as const)
        };
    }
}
