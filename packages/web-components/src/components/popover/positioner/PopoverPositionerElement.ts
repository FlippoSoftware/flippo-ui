import { adaptiveOrigin } from '@flippo-software/core-components/floating';
import { PopoverPositionerMachine } from '@flippo-software/core-components/popover';
import { mergeProps } from '@flippo-software/core-components/props';
import { effect, untracked } from '@flippo-software/store';

import type { FocusManager } from '@flippo-software/core-components/floating';
import type { PopoverPositionerOptions } from '@flippo-software/core-components/popover';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext, requestAncestorContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { FocusGuards } from '../../../lib/FocusGuards';
import { PropsApplier } from '../../../lib/PropsApplier';
import { prepareTopLayer, releaseTopLayer, showInTopLayer, showInTopLayerInOrder } from '../../../lib/topLayer';
import { PopoverPart, PopoverPositionerContext } from '../root/PopoverRootContext';

/**
 * Positions the popup against the trigger. It is shown in the top layer while the popup is mounted.
 *
 * Attributes: `side` (`top`, `bottom`, `left`, `right`, `inline-start`, `inline-end`; default `bottom`), `align`
 * (`start`, `center`, `end`), `side-offset`, `align-offset`, `collision-padding`, `arrow-padding`, `sticky`,
 * `position-method` (`fixed` by default: the top layer is positioned against the viewport), `keep-mounted`,
 * `disable-anchor-tracking`.
 * State attributes: `data-open`/`data-closed`, `data-side`, `data-align`, `data-anchor-hidden`.
 */
export class PopoverPositionerElement extends PopoverPart.withAttributes({
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
    /**
     * The floating tree node of this popup; nested popovers are its children.
     */
    readonly nodeId = createId('popover-node');

    private positionerMachine!: PopoverPositionerMachine;

    /**
     * Focus guards around the content, in the shadow root (used by modal popovers to trap the focus).
     */
    private readonly focusGuards = new FocusGuards(this.attachShadow({ mode: 'open' }));

    private readonly backdropApplier = new PropsApplier();

    /**
     * The floating tree node of the popover this one is nested in.
     */
    private parentNodeId: string | null = null;

    private cancelParentRequest: (() => void) | null = null;

    constructor() {
        super();
        declareProvider(this, PopoverPositionerContext);
    }

    /**
     * The machine of the positioner.
     */
    get machine(): PopoverPositionerMachine {
        return this.positionerMachine;
    }

    /**
     * Lets the focus manager of the popup use the focus guards. Returns a function that detaches it.
     */
    attachFocusGuards(focusManager: FocusManager): () => void {
        return this.focusGuards.attach(focusManager);
    }

    /**
     * After the root: waits for the positioner of the popover this one is nested in, if any.
     */
    protected override whenReady(callback: () => void) {
        super.whenReady(() => {
            this.cancelParentRequest?.();
            this.cancelParentRequest = requestAncestorContext(this, PopoverPositionerContext, PopoverPositionerElement, (parent) => {
                this.cancelParentRequest = null;
                this.parentNodeId = parent?.nodeId ?? null;
                callback();
            });
        });
    }

    override disconnectedCallback() {
        this.cancelParentRequest?.();
        this.cancelParentRequest = null;
        super.disconnectedCallback();
    }

    protected override createParts() {
        this.positionerMachine = new PopoverPositionerMachine(
            this.root.store,
            {
                nodeId: this.nodeId,
                // Inside the popup of another popover: a child of its node.
                parentNodeId: this.parentNodeId,
                tree: this.root.tree,
                adaptiveOrigin
            },
            this.getOptions()
        );
    }

    protected override applyOptions() {
        this.positionerMachine.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.positionerMachine.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.positionerMachine.connect();
        const stopProviding = provideContext(this, PopoverPositionerContext, this);
        // Before the props remove `hidden`, so that the popup is measured where it is shown.
        const stopShowing = effect(() => {
            const mounted = this.root.store.select('mounted');
            const backdropProps = this.positionerMachine.shouldRenderInternalBackdrop()
                ? this.positionerMachine.getInternalBackdropProps()
                : null;
            untracked(() => this.syncTopLayer(mounted, backdropProps));
        });
        return () => {
            stopShowing();
            this.syncTopLayer(false, null);
            stopProviding();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.positionerMachine?.setElement(element);
        if (element) {
            prepareTopLayer(element);
            showInTopLayer(element, this.root.store.select('mounted'));
        }
    }

    protected override onTargetRelease(element: HTMLElement) {
        releaseTopLayer(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.positionerMachine.getPositionerProps(), PopoverPositionerMachine.attrs(this.positionerMachine.getState()));
    }

    /**
     * The internal backdrop (modal popovers) and the positioner, stacked in the top layer in this order.
     */
    private syncTopLayer(mounted: boolean, backdropProps: Props | null) {
        const { internalBackdrop } = this.rootElement;
        const { context } = this.root.store;
        if (backdropProps) {
            prepareTopLayer(internalBackdrop);
            this.backdropApplier.apply(internalBackdrop, backdropProps);
            context.internalBackdropRef.current = internalBackdrop;
        } else if (context.internalBackdropRef.current === internalBackdrop) {
            this.backdropApplier.clear(internalBackdrop);
            context.internalBackdropRef.current = null;
        }
        showInTopLayerInOrder([
            [internalBackdrop, backdropProps !== null],
            [this.target, mounted]
        ]);
    }

    private getOptions(): PopoverPositionerOptions {
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
            direction: this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr'
        };
    }
}
