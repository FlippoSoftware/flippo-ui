import { AutocompleteRootMachine } from '@flippo-software/core-components/autocomplete';

import type { AutocompleteMode, AutocompleteRootOptions } from '@flippo-software/core-components/autocomplete';
import type { ComboboxChangeEventDetails, ComboboxRootMachine, ComboboxRootSetup } from '@flippo-software/core-components/combobox';

import { ComboboxElement } from '../../combobox/root/ComboboxElement';

import type { ComboboxRootDriver } from '../../combobox/root/ComboboxRootContext';

import type { AutocompleteValueChangeDetail } from './AutocompleteRootContext';

/**
 * A text input with suggestions: its value is the text, the list only helps typing it. The parts are those of the
 * combobox (`<prefix>-combobox-input`, `-combobox-positioner`, `-combobox-item`…).
 *
 * Attributes: those of the combobox (without selection), `default-value` (the text), `mode` (`list` by default:
 * the list is filtered; `inline`: the highlighted item completes the text; `both`; `none`), `open-on-input-click`
 * (off by default).
 * Properties: `value` (controlled: the text).
 * Events: `value-change` (cancelable; `detail: { value, reason }`), `open-change`, `open-change-complete`.
 */
export class AutocompleteElement extends ComboboxElement.withAttributes({
    /**
     * Controls how the autocomplete behaves with respect to list filtering and inline autocompletion.
     * - `list` (default): items are dynamically filtered based on the input value. The input value does not change
     *   based on the active item.
     * - `both`: items are dynamically filtered based on the input value, which will temporarily change based on the
     *   active item (inline autocompletion).
     * - `inline`: items are static (not filtered), and the input value will temporarily change based on the active item
     *   (inline autocompletion).
     * - `none`: items are static (not filtered), and the input value will not change based on the active item.
     * @default 'list'
     */
    mode: ['list', 'both', 'inline', 'none']
}) {
    private autocomplete!: AutocompleteRootMachine;

    /**
     * The value: the text of the input.
     */
    get textValue(): string {
        return this.autocomplete?.getValue() ?? '';
    }

    protected override createRoot(setup: ComboboxRootSetup): { combobox: ComboboxRootMachine; owner: ComboboxRootDriver } {
        const autocomplete = new AutocompleteRootMachine(this.getAutocompleteOptions(), setup);
        this.autocomplete = autocomplete;
        return {
            combobox: autocomplete.combobox,
            owner: {
                setOptions: () => autocomplete.setOptions(this.getAutocompleteOptions()),
                afterCommit: () => autocomplete.afterCommit(),
                connect: () => autocomplete.connect()
            }
        };
    }

    private getAutocompleteOptions(): AutocompleteRootOptions {
        const {
            selectionMode: _selectionMode,
            selectedValue: _selectedValue,
            defaultSelectedValue: _defaultSelectedValue,
            onSelectedValueChange: _onSelectedValueChange,
            inputValue: _inputValue,
            defaultInputValue: _defaultInputValue,
            onInputValueChange: _onInputValueChange,
            autoComplete: _autoComplete,
            isItemEqualToValue: _isItemEqualToValue,
            ...options
        } = this.getOptions();
        return {
            ...options,
            openOnInputClick: this.openOnInputClick ?? false,
            mode: (this.mode ?? 'list') as AutocompleteMode,
            value: this.value as string | undefined,
            defaultValue: this.defaultValue,
            onValueChange: (value: string, eventDetails: ComboboxChangeEventDetails) => {
                this.emit('value-change', { value, reason: eventDetails.reason } satisfies AutocompleteValueChangeDetail, eventDetails);
            }
        };
    }
}
