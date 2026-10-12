import { FormController } from '@flippo-software/core-components/form';

import type { FormErrors, FormSubmitEventDetails, FormValidationMode, FormValues } from '@flippo-software/core-components/form';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { MachineElement, property } from '../../../lib/MachineElement';

import { FormContext, type FormSubmitDetail } from './FormRootContext';

/**
 * A form that validates its fields: put it on a `<form>` with `as-child`. On submit, invalid fields are marked and the
 * first one is focused; when all are valid, `form-submit` is dispatched with their values.
 *
 * Attributes: `validation-mode` (`onSubmit` by default, `onBlur`, `onChange`).
 * Properties: `errors` (errors from the server, by field name: they show in the fields' errors until changed).
 * Events: `form-submit` (`detail: { values }`); the native `submit` too (call `preventDefault()` to handle it in
 * script).
 */
export class FormElement extends MachineElement.withAttributes({
    'validation-mode': ['onSubmit', 'onBlur', 'onChange'],
    errors: property<FormErrors>()
}) {
    private form!: FormController;

    constructor() {
        super();
        declareProvider(this, FormContext);
    }

    get machine(): FormController {
        return this.form;
    }

    protected override createParts() {
        this.form = new FormController(this.getOptions());
    }

    protected override applyOptions() {
        this.form.setOptions(this.getOptions());
    }

    protected override connectParts() {
        return provideContext(this, FormContext, this);
    }

    protected override getProps(): Props {
        return this.form.getFormProps();
    }

    private getOptions() {
        return {
            validationMode: (this.validationMode ?? 'onSubmit') as FormValidationMode,
            errors: this.errors,
            onFormSubmit: (values: FormValues, _eventDetails: FormSubmitEventDetails) => {
                this.emit('form-submit', { values } satisfies FormSubmitDetail);
            }
        };
    }
}
