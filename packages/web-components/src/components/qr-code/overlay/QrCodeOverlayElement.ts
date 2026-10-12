import { MenuItemIndicatorMachine } from '@flippo-software/core-components/menu';
import { mergeProps } from '@flippo-software/core-components/props';
import { QrCodeMachine } from '@flippo-software/core-components/qr-code';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { QrCodePart } from '../root/QrCodeRootContext';

/**
 * Shown over the frame while the code is generated or failed (e.g. a spinner, an error).
 *
 * State attributes: `data-status-*`, transition attributes.
 */
export class QrCodeOverlayElement extends QrCodePart.withAttributes({}) {
    private visibility!: MenuItemIndicatorMachine;

    protected override createParts() {
        this.visibility = new MenuItemIndicatorMachine(untracked(() => this.qrCode.isOverlayRendered()));
    }

    protected override applyOptions() {}

    protected override connectParts() {
        const disconnect = this.visibility.connect();
        const stop = effect(() => {
            const rendered = this.qrCode.isOverlayRendered();
            untracked(() => this.visibility.setChecked(rendered));
        });
        return () => {
            stop();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.visibility?.setElement(element);
    }

    protected override getProps(): Props {
        const state = { ...this.qrCode.getState(), transitionStatus: this.visibility.transitions.state.transitionStatus };
        return mergeProps(QrCodeMachine.overlayAttrs(state), { hidden: !this.visibility.shouldRender() });
    }
}
