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
    /**
     * Which side of the anchor element to align the popup against.
     * May automatically change to avoid collisions.
     * @default 'top'
     */
    side: ['top', 'bottom', 'left', 'right', 'inline-start', 'inline-end'],
    /**
     * How to align the popup relative to the specified side.
     * @default 'center'
     */
    align: ['start', 'center', 'end'],
    /**
     * Distance between the anchor and the popup in pixels.
     * @default 0
     */
    'side-offset': 'number',
    /**
     * Additional offset along the alignment axis in pixels.
     * @default 0
     */
    'align-offset': 'number',
    /**
     * Additional space to maintain from the edge of the collision boundary.
     * @default 5
     */
    'collision-padding': 'number',
    /**
     * Minimum distance to maintain between the arrow and the edges of the popup.
     *
     * Use it to prevent the arrow element from hanging out of the rounded corners of a popup.
     * @default 5
     */
    'arrow-padding': 'number',
    /**
     * Whether to maintain the popup in the viewport after
     * the anchor element was scrolled out of view.
     * @default false
     */
    sticky: 'boolean',
    /**
     * Determines which CSS `position` property to use.
     * @default 'fixed'
     */
    'position-method': ['fixed', 'absolute'],
    /**
     * Whether to keep the popup in the DOM while the tooltip is closed.
     * @default false
     */
    'keep-mounted': 'boolean',
    /**
     * Whether to disable the popup from tracking any layout shift of its positioning anchor.
     * @default false
     */
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
