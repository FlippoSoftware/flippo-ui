import { ComboboxPositionerMachine } from '@flippo-software/core-components/combobox';
import { mergeProps } from '@flippo-software/core-components/props';
import { effect, untracked } from '@flippo-software/store';

import type { FocusManager } from '@flippo-software/core-components/floating';
import type { AnchorPositioningSharedOptions } from '@flippo-software/core-components/positioning';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { FocusGuards } from '../../../lib/FocusGuards';
import { property } from '../../../lib/MachineElement';
import { PropsApplier } from '../../../lib/PropsApplier';
import { prepareTopLayer, releaseTopLayer, showInTopLayer, showInTopLayerInOrder } from '../../../lib/topLayer';
import { ComboboxPart, ComboboxPositionerContext } from '../root/ComboboxRootContext';

/**
 * Positions the list against the input. It is shown in the top layer while the list is mounted.
 *
 * Attributes: `side` (`bottom`), `align` (`center`), `side-offset`, `align-offset`, `collision-padding` (5),
 * `arrow-padding`, `sticky`, `position-method` (`fixed` by default), `disable-anchor-tracking`. Property: `anchor`
 * (an element, a ref or a function returning one; the input by default).
 * State attributes: `data-open`/`data-closed`, `data-side`, `data-align`, `data-anchor-hidden`, `data-empty`.
 */
export class ComboboxPositionerElement extends ComboboxPart.withAttributes({
    side: ['top', 'bottom', 'left', 'right', 'inline-start', 'inline-end'],
    align: ['start', 'center', 'end'],
    'side-offset': 'number',
    'align-offset': 'number',
    'collision-padding': 'number',
    'arrow-padding': 'number',
    sticky: 'boolean',
    'position-method': ['fixed', 'absolute'],
    'disable-anchor-tracking': 'boolean',
    anchor: property<AnchorPositioningSharedOptions['anchor']>()
}) {
    private positionerMachine!: ComboboxPositionerMachine;

    private readonly focusGuards = new FocusGuards(this.attachShadow({ mode: 'open' }));

    private readonly backdropApplier = new PropsApplier();

    constructor() {
        super();
        declareProvider(this, ComboboxPositionerContext);
    }

    get machine(): ComboboxPositionerMachine {
        return this.positionerMachine;
    }

    attachFocusGuards(focusManager: FocusManager): () => void {
        return this.focusGuards.attach(focusManager);
    }

    protected override createParts() {
        this.positionerMachine = new ComboboxPositionerMachine(this.root, this.getOptions());
    }

    protected override applyOptions() {
        this.positionerMachine.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.positionerMachine.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.positionerMachine.connect();
        const stopProviding = provideContext(this, ComboboxPositionerContext, this);
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
        return mergeProps(this.positionerMachine.getPositionerProps(), ComboboxPositionerMachine.attrs(this.positionerMachine.getState()));
    }

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

    private getOptions() {
        return {
            side: this.side ?? 'bottom',
            align: this.align ?? 'center',
            anchor: this.anchor,
            sideOffset: this.sideOffset ?? 0,
            alignOffset: this.alignOffset ?? 0,
            collisionBoundary: 'clipping-ancestors' as const,
            collisionPadding: this.collisionPadding ?? 5,
            arrowPadding: this.arrowPadding ?? 5,
            sticky: this.sticky ?? false,
            positionMethod: this.positionMethod ?? 'fixed',
            disableAnchorTracking: this.disableAnchorTracking ?? false,
            direction: this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? ('rtl' as const) : ('ltr' as const)
        };
    }
}
