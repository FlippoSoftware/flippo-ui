import { registerPopoverDescription } from '@flippo-software/core-components/popover';

import { PopoverLabelPart } from '../root/PopoverRootContext';

/**
 * A paragraph that describes the popover (`aria-describedby` of the popup).
 */
export class PopoverDescriptionElement extends PopoverLabelPart {
    constructor() {
        super('popover-description');
    }

    protected override register(id: string) {
        return registerPopoverDescription(this.root.store, id);
    }
}
