import type { FormValues } from '@flippo-software/core-components/form';

import { createContext } from '../../../lib/context';

import type { FormElement } from './FormElement';

export type FormSubmitDetail = {
    values: FormValues;
};

export const FormContext = createContext<FormElement>('form');
