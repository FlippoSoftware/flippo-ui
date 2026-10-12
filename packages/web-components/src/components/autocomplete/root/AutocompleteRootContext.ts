import type { ComboboxChangeEventDetails } from '@flippo-software/core-components/combobox';

export type AutocompleteValueChangeDetail = {
    value: string;
    reason: ComboboxChangeEventDetails['reason'];
};
