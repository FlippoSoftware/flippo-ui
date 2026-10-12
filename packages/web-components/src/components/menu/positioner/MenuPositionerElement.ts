import { MenuPositionerMachine } from '@flippo-software/core-components/menu';
import { mergeProps } from '@flippo-software/core-components/props';
import { effect, untracked } from '@flippo-software/store';

import type { FocusManager } from '@flippo-software/core-components/floating';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { FocusGuards } from '../../../lib/FocusGuards';
import { PropsApplier } from '../../../lib/PropsApplier';
import { prepareTopLayer, releaseTopLayer, showInTopLayer, showInTopLayerInOrder } from '../../../lib/topLayer';
import { MenuPart, MenuPositionerContext } from '../root/MenuRootContext';

/**
 * Positions the popup against the trigger (submenus: against their item, to the inline end). It is shown in the top
 * layer while the menu is mounted.
 *
 * Attributes: `side`, `align`, `side-offset`, `align-offset`, `collision-padding` (5 by default), `arrow-padding`,
 * `sticky`, `position-method` (`fixed` by default), `keep-mounted`, `disable-anchor-tracking`.
 * State attributes: `data-open`/`data-closed`, `data-side`, `data-align`, `data-anchor-hidden`, `data-nested`.
 */
export class MenuPositionerElement extends MenuPart.withAttributes({
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
    private positionerMachine!: MenuPositionerMachine;

    /**
     * Focus guards around the content, in the shadow root: Tab out of the popup goes back to the page.
     */
    private readonly focusGuards = new FocusGuards(this.attachShadow({ mode: 'open' }));

    private readonly backdropApplier = new PropsApplier();

    constructor() {
        super();
        declareProvider(this, MenuPositionerContext);
    }

    /**
     * The machine of the positioner.
     */
    get machine(): MenuPositionerMachine {
        return this.positionerMachine;
    }

    /**
     * Lets the focus manager of the popup use the focus guards. Returns a function that detaches it.
     */
    attachFocusGuards(focusManager: FocusManager): () => void {
        return this.focusGuards.attach(focusManager);
    }

    protected override createParts() {
        this.positionerMachine = new MenuPositionerMachine(this.root, this.getOptions());
    }

    protected override applyOptions() {
        this.positionerMachine.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.positionerMachine.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.positionerMachine.connect();
        const stopProviding = provideContext(this, MenuPositionerContext, this);
        // Before the props remove `hidden`, so that the popup is measured where it is shown.
        const stopShowing = effect(() => {
            const { store } = this.root;
            const mounted = store.select('mounted');
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
            showInTopLayer(element, this.root.store.select('mounted'));
        }
    }

    protected override onTargetRelease(element: HTMLElement) {
        releaseTopLayer(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.positionerMachine.getPositionerProps(), MenuPositionerMachine.attrs(this.positionerMachine.getState()));
    }

    /**
     * The internal backdrop (modal menus), the backdrop and the positioner, stacked in the top layer in this order.
     */
    private syncTopLayer(mounted: boolean, backdropProps: Props | null, backdrop: HTMLElement | null) {
        const { internalBackdrop } = this.rootElement;
        if (backdropProps) {
            prepareTopLayer(internalBackdrop);
            this.backdropApplier.apply(internalBackdrop, backdropProps);
            this.positionerMachine.setInternalBackdrop(internalBackdrop);
        } else {
            this.backdropApplier.clear(internalBackdrop);
        }
        showInTopLayerInOrder([
            [internalBackdrop, backdropProps !== null],
            [backdrop, mounted],
            [this.target, mounted]
        ]);
    }

    private getOptions() {
        return {
            side: this.side,
            align: this.align,
            sideOffset: this.sideOffset,
            alignOffset: this.alignOffset,
            collisionBoundary: 'clipping-ancestors' as const,
            collisionPadding: this.collisionPadding ?? 5,
            arrowPadding: this.arrowPadding,
            sticky: this.sticky ?? false,
            positionMethod: this.positionMethod ?? 'fixed',
            keepMounted: this.keepMounted,
            disableAnchorTracking: this.disableAnchorTracking ?? false,
            direction: this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? ('rtl' as const) : ('ltr' as const)
        };
    }
}
