import { ToastLabelPart } from '../root/ToastRootContext';

/**
 * The title of the toast (its `title`, unless the element has its own content).
 */
export class ToastTitleElement extends ToastLabelPart {
    constructor() {
        super('toast-title');
    }

    protected override getText() {
        return this.toast.title;
    }

    protected override setId(id: string | undefined) {
        this.toastElement.machine.setTitleId(id);
    }
}
