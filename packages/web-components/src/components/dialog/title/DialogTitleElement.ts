import { registerDialogTitle } from '@flippo-software/core-components/dialog';

import { DialogLabelPart } from '../root/DialogRootContext';

/**
 * The heading that labels the dialog (`aria-labelledby` of the popup).
 */
export class DialogTitleElement extends DialogLabelPart {
    constructor() {
        super('dialog-title');
    }

    protected override register(id: string) {
        return registerDialogTitle(this.root.store, id);
    }
}
