import { FieldRootMachine } from '@flippo-software/core-components/field';
import { LabelableController } from '@flippo-software/core-components/labelable';

import type { FieldRootOptions, FieldValidate } from '@flippo-software/core-components/field';
import type { FormValidationMode } from '@flippo-software/core-components/form';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext, requestAncestorContexts } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { MachineElement, property } from '../../../lib/MachineElement';
import { FieldsetElement } from '../../fieldset/root/FieldsetElement';
import { FieldsetContext } from '../../fieldset/root/FieldsetRootContext';
import { FormElement } from '../../form/root/FormElement';
import { FormContext } from '../../form/root/FormRootContext';

import { FieldContext, LabelableContext } from './FieldRootContext';

/**
 * A form control with its label, description and error, and its validation: the root of the `-field-*` parts.
 *
 * Attributes: `name` (of the control), `disabled`, `invalid` (forces the invalid state), `dirty`, `touched`,
 * `validation-mode` (`onSubmit` by default, or the form's; `onBlur`, `onChange`), `validation-debounce-time` (ms).
 * Properties: `validate` (`(value, formValues) => error | errors | null`, may be async).
 * State attributes (on all parts): `data-disabled`, `data-valid` / `data-invalid`, `data-dirty`, `data-touched`,
 * `data-filled`, `data-focused`.
 */
export class FieldElement extends MachineElement.withAttributes({
    name: 'string',
    disabled: 'boolean',
    invalid: 'boolean',
    dirty: 'boolean',
    touched: 'boolean',
    'validation-mode': ['onSubmit', 'onBlur', 'onChange'],
    'validation-debounce-time': 'number',
    validate: property<FieldValidate>()
}) {
    readonly labelable = new LabelableController(createId('field-control'));

    private fieldMachine!: FieldRootMachine;

    private form: FormElement | undefined;

    private fieldset: FieldsetElement | undefined;

    private cancelRequests: (() => void) | null = null;

    constructor() {
        super();
        declareProvider(this, FieldContext);
        declareProvider(this, LabelableContext);
    }

    get machine(): FieldRootMachine {
        return this.fieldMachine;
    }

    /**
     * Waits for the form and the fieldset around it, if any.
     */
    protected override whenReady(callback: () => void) {
        this.cancelRequests?.();
        this.cancelRequests = requestAncestorContexts(
            this,
            [
                [FormContext, FormElement],
                [FieldsetContext, FieldsetElement]
            ],
            ([form, fieldset]) => {
                this.cancelRequests = null;
                this.form = form;
                this.fieldset = fieldset;
                callback();
            }
        );
    }

    override disconnectedCallback() {
        this.cancelRequests?.();
        this.cancelRequests = null;
        super.disconnectedCallback();
    }

    protected override createParts() {
        this.fieldMachine = new FieldRootMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.fieldMachine.setOptions(this.getOptions());
    }

    protected override connectParts() {
        const disconnect = this.fieldMachine.connect();
        const stopField = provideContext(this, FieldContext, this);
        const stopLabelable = provideContext(this, LabelableContext, this);
        return () => {
            stopLabelable();
            stopField();
            disconnect();
        };
    }

    protected override getProps(): Props {
        return FieldRootMachine.attrs(this.fieldMachine.getState());
    }

    private getOptions(): FieldRootOptions {
        return {
            name: this.name,
            disabled: this.disabled ?? false,
            invalid: this.invalid,
            dirty: this.dirty,
            touched: this.touched,
            validationMode: this.validationMode as FormValidationMode | undefined,
            validationDebounceTime: this.validationDebounceTime ?? 0,
            validate: (value, formValues) => this.validate?.(value, formValues) ?? null,
            form: this.form?.machine ?? null,
            fieldset: this.fieldset?.machine ?? null,
            labelable: this.labelable
        };
    }
}
