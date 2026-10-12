import { registerDialogDescription } from '@flippo-software/core-components/dialog';

import { DialogLabelPart } from '../root/DialogRootContext';

/**
 * A paragraph that describes the dialog (`aria-describedby` of the popup).
 */
export class DialogDescriptionElement extends DialogLabelPart {
    constructor() {
        super('dialog-description');
    }

    protected override register(id: string) {
        return registerDialogDescription(this.root.store, id);
    }
}
