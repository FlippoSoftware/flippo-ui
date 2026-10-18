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
    /**
     * Identifies the field when a form is submitted.
     * Takes precedence over the `name` attribute on the `<prefix>-field-control`.
     */
    name: 'string',
    /**
     * Whether the component should ignore user interaction.
     * Takes precedence over the `disabled` attribute on the `<prefix>-field-control`.
     * @default false
     */
    disabled: 'boolean',
    /**
     * Whether the field is invalid.
     * Useful when the field state is controlled by an external library.
     */
    invalid: 'boolean',
    /**
     * Whether the field's value has been changed from its initial value.
     * Useful when the field state is controlled by an external library.
     */
    dirty: 'boolean',
    /**
     * Whether the field has been touched.
     * Useful when the field state is controlled by an external library.
     */
    touched: 'boolean',
    /**
     * Determines when the field should be validated.
     * This takes precedence over the `validation-mode` attribute on `<prefix>-form`.
     *
     * - `onSubmit`: triggers validation when the form is submitted, and re-validates on change after submission.
     * - `onBlur`: triggers validation when the control loses focus.
     * - `onChange`: triggers validation on every change to the control value.
     * @default 'onSubmit'
     */
    'validation-mode': ['onSubmit', 'onBlur', 'onChange'],
    /**
     * How long to wait between `validate` callbacks if
     * `validation-mode="onChange"` is used. Specified in milliseconds.
     * @default 0
     */
    'validation-debounce-time': 'number',
    /**
     * A function for custom validation. Return a string or an array of strings with
     * the error message(s) if the value is invalid, or `null` if the value is valid.
     * Asynchronous functions are supported, but they do not prevent form submission
     * when using `validation-mode="onSubmit"`.
     */
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
