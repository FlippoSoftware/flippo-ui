import { mergeProps } from '@flippo-software/core-components/props';
import { SelectPositionerMachine } from '@flippo-software/core-components/select';
import { effect, untracked } from '@flippo-software/store';

import type { FocusManager } from '@flippo-software/core-components/floating';
import type { Props } from '@flippo-software/core-components/props';
import type { SelectPositionerOptions } from '@flippo-software/core-components/select';

import { declareProvider, provideContext } from '../../../lib/context';
import { FocusGuards } from '../../../lib/FocusGuards';
import { PropsApplier } from '../../../lib/PropsApplier';
import { prepareTopLayer, releaseTopLayer, showInTopLayer, showInTopLayerInOrder } from '../../../lib/topLayer';
import { SelectPart, SelectPositionerContext } from '../root/SelectRootContext';

/**
 * Positions the list: over the trigger, its chosen item aligned with the trigger's value (`align-item-with-trigger`,
 * the default), or against the trigger like a popover. It is shown in the top layer while the list is mounted.
 *
 * Attributes: `align-item-with-trigger` (`"false"` to position like a popover), `side`, `align`, `side-offset`,
 * `align-offset`, `collision-padding`, `arrow-padding`, `sticky`, `position-method` (`fixed` by default),
 * `disable-anchor-tracking`.
 * State attributes: `data-open`/`data-closed`, `data-side` (`none` when aligned with the trigger), `data-align`,
 * `data-anchor-hidden`.
 */
export class SelectPositionerElement extends SelectPart.withAttributes({
    'align-item-with-trigger': 'boolean',
    side: ['top', 'bottom', 'left', 'right', 'inline-start', 'inline-end'],
    align: ['start', 'center', 'end'],
    'side-offset': 'number',
    'align-offset': 'number',
    'collision-padding': 'number',
    'arrow-padding': 'number',
    sticky: 'boolean',
    'position-method': ['fixed', 'absolute'],
    'disable-anchor-tracking': 'boolean'
}) {
    private positionerMachine!: SelectPositionerMachine;

    /**
     * Focus guards around the content, in the shadow root.
     */
    private readonly focusGuards = new FocusGuards(this.attachShadow({ mode: 'open' }));

    private readonly backdropApplier = new PropsApplier();

    constructor() {
        super();
        declareProvider(this, SelectPositionerContext);
    }

    get machine(): SelectPositionerMachine {
        return this.positionerMachine;
    }

    /**
     * Lets the focus manager of the popup use the focus guards. Returns a function that detaches it.
     */
    attachFocusGuards(focusManager: FocusManager): () => void {
        return this.focusGuards.attach(focusManager);
    }

    protected override createParts() {
        this.positionerMachine = new SelectPositionerMachine(this.root, this.getOptions());
    }

    protected override applyOptions() {
        this.positionerMachine.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.positionerMachine.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.positionerMachine.connect();
        const stopProviding = provideContext(this, SelectPositionerContext, this);
        // Before the props remove `hidden`, so that the list is measured where it is shown.
        const stopShowing = effect(() => {
            const { mounted } = this.root.store.state;
            const backdropProps = this.positionerMachine.shouldRenderInternalBackdrop()
                ? this.positionerMachine.getInternalBackdropProps()
                : null;
            const { backdrop } = this.rootElement.parts.state;
            untracked(() => this.syncTopLayer(mounted, backdropProps, backdrop));
        });
        return () => {
            stopShowing();
            this.syncTopLayer(false, null, this.rootElement.parts.state.backdrop);
            stopProviding();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.positionerMachine?.setElement(element);
        if (element) {
            prepareTopLayer(element);
            showInTopLayer(element, this.root.store.state.mounted);
        }
    }

    protected override onTargetRelease(element: HTMLElement) {
        releaseTopLayer(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.positionerMachine.getPositionerProps(), SelectPositionerMachine.attrs(this.positionerMachine.getState()));
    }

    /**
     * The internal backdrop (modal selects), the backdrop and the positioner, stacked in the top layer in this order.
     */
    private syncTopLayer(mounted: boolean, backdropProps: Props | null, backdrop: HTMLElement | null) {
        const { internalBackdrop } = this.rootElement;
        if (backdropProps) {
            prepareTopLayer(internalBackdrop);
            this.backdropApplier.apply(internalBackdrop, backdropProps);
        } else {
            this.backdropApplier.clear(internalBackdrop);
        }
        showInTopLayerInOrder([
            [internalBackdrop, backdropProps !== null],
            [backdrop, mounted],
            [this.target, mounted]
        ]);
    }

    private getOptions(): SelectPositionerOptions {
        return {
            alignItemWithTrigger: this.alignItemWithTrigger ?? true,
            side: this.side,
            align: this.align,
            sideOffset: this.sideOffset,
            alignOffset: this.alignOffset,
            collisionBoundary: 'clipping-ancestors',
            collisionPadding: this.collisionPadding,
            arrowPadding: this.arrowPadding,
            sticky: this.sticky,
            positionMethod: this.positionMethod ?? 'fixed',
            disableAnchorTracking: this.disableAnchorTracking,
            direction: this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr'
        } as SelectPositionerOptions;
    }
}
