import { ToastLabelPart } from '../root/ToastRootContext';

/**
 * The description of the toast (its `description`, unless the element has its own content).
 */
export class ToastDescriptionElement extends ToastLabelPart {
    constructor() {
        super('toast-description');
    }

    protected override getText() {
        return this.toast.description;
    }

    protected override setId(id: string | undefined) {
        this.toastElement.machine.setDescriptionId(id);
    }
}
