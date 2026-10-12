import { DialogBackdrop, DialogPopupMachine } from '@flippo-software/core-components/dialog';
import { getInternalBackdropProps } from '@flippo-software/core-components/dom';
import { mergeProps } from '@flippo-software/core-components/props';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { PropsApplier } from '../../../lib/PropsApplier';
import { prepareTopLayer, releaseTopLayer, showInTopLayerInOrder } from '../../../lib/topLayer';
import { DialogPart } from '../root/DialogRootContext';

/**
 * The window of the dialog, shown in the top layer (centered by the browser unless styled).
 *
 * State attributes: `data-open`/`data-closed`, `data-nested`, `data-nested-dialog-open`, transition attributes.
 * CSS variables: `--nested-dialogs` (the number of open nested dialogs).
 */
export class DialogPopupElement extends DialogPart.withAttributes({}) {
    /**
     * Whether the browser centers the popup (the default style of popovers).
     */
    protected readonly centered: boolean = true;

    private popup!: DialogPopupMachine;

    private readonly internalBackdropApplier = new PropsApplier();

    protected override createParts() {
        // No portal: the popup stays in place, in the top layer.
        this.popup = new DialogPopupMachine(this.root.store, {}, { portal: null });
    }

    protected override applyOptions() {
        this.popup.setOptions({});
    }

    protected override afterOptions() {
        this.popup.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.popup.connect();
        const detachGuards = this.rootElement.attachFocusGuards(this.popup.focusManager);
        const stopShowing = effect(() => {
            const { store } = this.root;
            const mounted = store.select('mounted');
            const internal = mounted && store.select('modal') === true;
            const internalProps = internal ? getInternalBackdropProps(null, !store.select('open')) : null;
            const { backdrop, forceRenderBackdrop } = this.rootElement.parts.state;
            const backdropShown = mounted && DialogBackdrop.shouldRender(store, forceRenderBackdrop);
            untracked(() => this.syncTopLayer(mounted, internalProps, backdrop, backdropShown));
        });
        return () => {
            stopShowing();
            this.syncTopLayer(false, null, this.rootElement.parts.state.backdrop, false);
            detachGuards();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.popup?.setElement(element);
        if (element) {
            prepareTopLayer(element, { centered: this.centered });
        }
    }

    protected override onTargetRelease(element: HTMLElement) {
        releaseTopLayer(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.popup.getPopupProps(), DialogPopupMachine.attrs(this.popup.getState()));
    }

    /**
     * The internal backdrop, the backdrop and the popup, stacked in the top layer in this order.
     */
    private syncTopLayer(mounted: boolean, internalProps: Props | null, backdrop: HTMLElement | null, backdropShown: boolean) {
        const { internalBackdrop } = this.rootElement;
        const { context } = this.root.store;
        if (internalProps) {
            prepareTopLayer(internalBackdrop);
            this.internalBackdropApplier.apply(internalBackdrop, internalProps);
            context.internalBackdropRef.current = internalBackdrop;
        } else if (context.internalBackdropRef.current === internalBackdrop) {
            this.internalBackdropApplier.clear(internalBackdrop);
            context.internalBackdropRef.current = null;
        }
        showInTopLayerInOrder([
            [internalBackdrop, internalProps !== null],
            [backdrop, backdropShown],
            [this.target, mounted]
        ]);
    }
}
