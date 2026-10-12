import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { QrCodePart } from '../root/QrCodeRootContext';

/**
 * Where the QR code is drawn (in its shadow root, `part="code"`).
 */
export class QrCodeFrameElement extends QrCodePart.withAttributes({}) {
    private readonly container: HTMLDivElement;

    constructor() {
        super();
        const root = this.attachShadow({ mode: 'open' });
        this.container = this.ownerDocument.createElement('div');
        this.container.setAttribute('part', 'code');
        root.append(this.container, this.ownerDocument.createElement('slot'));
    }

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        // Each generated code is drawn in place of the previous one.
        return effect(() => {
            const { renderer } = this.qrCode.store.state;
            untracked(() => {
                this.container.replaceChildren();
                if (renderer) {
                    this.qrCode.setFrameElement(this.container);
                }
            });
        });
    }

    protected override getProps(): Props {
        return this.stateAttributes;
    }
}
