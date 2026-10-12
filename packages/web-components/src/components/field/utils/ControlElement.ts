import { createDetachedField } from '@flippo-software/core-components/field';

import type { FieldRootMachine } from '@flippo-software/core-components/field';
import type { LabelableController } from '@flippo-software/core-components/labelable';

import { requestAncestorContexts } from '../../../lib/context';
import { FormControl } from '../../../lib/FormControl';
import { MachineElement } from '../../../lib/MachineElement';
import { FIELD_CONTROL_CONTEXTS } from '../root/FieldRootContext';

import type { FieldItemElement } from '../item/FieldItemElement';
import type { FieldElement } from '../root/FieldElement';
import type { LabelableProvider } from '../root/FieldRootContext';

/**
 * Base of the form controls (checkbox, switch, radio group…): the element is form-associated (it submits under the
 * name of the control, and is disabled and reset with its form), its hidden `<input>` is in its shadow root, and it
 * takes the field, the labelling element and the field item around it, if any.
 */
export abstract class ControlElement extends MachineElement {
    static formAssociated = true;

    protected readonly formControl: FormControl;

    protected field: FieldElement | undefined;

    protected fieldItem: FieldItemElement | undefined;

    private labelableProvider: LabelableProvider | undefined;

    /**
     * Whether a disabled `<fieldset>` around the element disables it.
     */
    protected formDisabled = false;

    private readonly detachedField = createDetachedField();

    private cancelRequests: (() => void) | null = null;

    constructor(associated = true) {
        super();
        this.formControl = new FormControl(this, associated);
    }

    protected get labelable(): LabelableController | null {
        return this.labelableProvider?.labelable ?? null;
    }

    /**
     * The labelling controller of the element (for its parts).
     */
    get labelableController(): LabelableController | null {
        return this.labelable;
    }

    /**
     * The field around the element, or a field of its own.
     */
    protected get fieldMachine(): FieldRootMachine {
        return this.field?.machine ?? this.detachedField;
    }

    /**
     * Requests the contexts specific to the control (e.g. its group), then calls `callback`.
     *
     * @returns A function that cancels the requests.
     */
    protected requestControlContexts(callback: () => void): () => void {
        callback();
        return () => {};
    }

    /**
     * Restores the initial value (the form is reset).
     */
    protected abstract resetValue(): void;

    protected override whenReady(callback: () => void) {
        this.cancelRequests?.();
        this.cancelRequests = requestAncestorContexts(this, FIELD_CONTROL_CONTEXTS, ([field, labelable, item]) => {
            this.field = field;
            this.labelableProvider = labelable;
            this.fieldItem = item;
            this.cancelRequests = this.requestControlContexts(() => {
                this.cancelRequests = null;
                callback();
            });
        });
    }

    override disconnectedCallback() {
        this.cancelRequests?.();
        this.cancelRequests = null;
        super.disconnectedCallback();
    }

    formDisabledCallback(disabled: boolean) {
        this.formDisabled = disabled;
        this.invalidateOptions();
    }

    formResetCallback() {
        this.resetValue();
    }

    /**
     * The value submitted with the form: `value` under `name`, nothing without a name or a value.
     */
    protected toFormValue(name: string | undefined, value: string | null): FormData | null {
        if (!name || value === null) {
            return null;
        }
        const data = new FormData();
        data.append(name, value);
        return data;
    }
}
