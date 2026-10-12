import { PopoverLabelPart } from '../root/PopoverRootContext';

/**
 * The heading that labels the popover (`aria-labelledby` of the popup).
 */
export class PopoverTitleElement extends PopoverLabelPart {
    constructor() {
        super('popover-title');
    }

    protected override register(id: string) {
        this.root.store.set('titleElementId', id);
        return () => this.root.store.set('titleElementId', undefined);
    }
}
