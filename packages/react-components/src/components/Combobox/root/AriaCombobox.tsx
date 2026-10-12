import React from 'react';
import * as ReactDOM from 'react-dom';

import { ComboboxRootMachine } from '@flippo-software/core-components/combobox';

import type { ComboboxRootOptions } from '@flippo-software/core-components/combobox';

import { useMachine } from '~@lib/core';
import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';

import type { HeadlessUIChangeEventDetails, HeadlessUIGenericEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { Group } from '~@lib/resolveValueLabel';

import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { useLabelableContext } from '../../LabelableProvider';

import { ComboboxRootProvider } from './ComboboxRootProvider';

/**
 * @internal
 */
export function AriaCombobox<Value, Mode extends SelectionMode = 'none'>(
    props: Omit<ComboboxRootConditionalProps<Value, Mode>, 'items'> & {
        items: readonly Group<any>[];
    }
): React.JSX.Element;
export function AriaCombobox<Value, Mode extends SelectionMode = 'none'>(
    props: Omit<ComboboxRootConditionalProps<Value, Mode>, 'items'> & {
        items?: readonly any[];
    }
): React.JSX.Element;
export function AriaCombobox<Value = any, Mode extends SelectionMode = 'none'>(
    props: ComboboxRootConditionalProps<Value, Mode>
): React.JSX.Element {
    const { field } = useFieldRootContext();
    const { labelable } = useLabelableContext();
    const defaultId = useHeadlessUiId() as string;

    const root = useMachine(
        (options) => new ComboboxRootMachine(options, { defaultId, field, labelable, flushSync: ReactDOM.flushSync }),
        getComboboxRootOptions(props as AriaCombobox.Props<Value, Mode>)
    );

    return (
        <ComboboxRootProvider root={root} actionsRef={props.actionsRef} inputRef={props.inputRef}>
            {props.children}
        </ComboboxRootProvider>
    );
}

/**
 * The machine options of the combobox root props.
 */
export function getComboboxRootOptions(props: AriaCombobox.Props<any, SelectionMode>): ComboboxRootOptions {
    const {
        id,
        onOpenChangeComplete,
        defaultSelectedValue = null,
        selectedValue,
        onSelectedValueChange,
        defaultInputValue,
        inputValue,
        onInputValueChange,
        open,
        defaultOpen = false,
        onOpenChange,
        selectionMode = 'none',
        onItemHighlighted,
        name,
        disabled = false,
        readOnly = false,
        required = false,
        grid = false,
        items,
        filteredItems,
        filter,
        openOnInputClick = true,
        autoHighlight = false,
        keepHighlight = false,
        highlightItemOnHover = true,
        itemToStringLabel,
        itemToStringValue,
        isItemEqualToValue,
        virtualized = false,
        inline = false,
        fillInputOnItemPress = true,
        modal = false,
        limit = -1,
        autoComplete = 'list',
        locale,
        submitOnItemClick = false,
        actionsRef
    } = props;
    return {
        id,
        onOpenChangeComplete,
        defaultSelectedValue,
        selectedValue,
        onSelectedValueChange: onSelectedValueChange as never,
        defaultInputValue,
        inputValue,
        onInputValueChange: onInputValueChange as never,
        open,
        defaultOpen,
        onOpenChange: onOpenChange as never,
        selectionMode,
        onItemHighlighted: onItemHighlighted as never,
        name,
        disabled,
        readOnly,
        required,
        grid,
        items: items as never,
        filteredItems: filteredItems as never,
        filter: filter as never,
        openOnInputClick,
        autoHighlight,
        keepHighlight,
        highlightItemOnHover,
        itemToStringLabel: itemToStringLabel as never,
        itemToStringValue: itemToStringValue as never,
        isItemEqualToValue: isItemEqualToValue as never,
        virtualized,
        inline,
        fillInputOnItemPress,
        modal,
        limit,
        autoComplete,
        locale,
        submitOnItemClick,
        hasActionsRef: actionsRef != null
    };
}

type SelectionMode = 'single' | 'multiple' | 'none';

type ComboboxItemValueType<ItemValue, Mode extends SelectionMode> = Mode extends 'multiple' ? ItemValue[] : ItemValue;

type ComboboxRootProps<ItemValue> = {
    children?: React.ReactNode;
    /**
     * Identifies the field when a form is submitted.
     */
    name?: string;
    /**
     * The id of the component.
     */
    id?: string;
    /**
     * Whether the user must choose a value before submitting a form.
     * @default false
     */
    required?: boolean;
    /**
     * Whether the user should be unable to choose a different option from the popup.
     * @default false
     */
    readOnly?: boolean;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * Whether the popup is initially open.
     *
     * To render a controlled popup, use the `open` prop instead.
     * @default false
     */
    defaultOpen?: boolean;
    /**
     * Whether the popup is currently open. Use when controlled.
     */
    open?: boolean;
    /**
     * Event handler called when the popup is opened or closed.
     */
    onOpenChange?: (open: boolean, eventDetails: AriaCombobox.ChangeEventDetails) => void;
    /**
     * Event handler called after any animations complete when the popup is opened or closed.
     */
    onOpenChangeComplete?: (open: boolean) => void;
    /**
     * Whether the popup opens when clicking the input.
     * @default true
     */
    openOnInputClick?: boolean;
    /**
     * Whether the first matching item is highlighted automatically.
     * - `false`: do not highlight automatically.
     * - `true`: highlight after the user types and keep the highlight while the query changes.
     * - `'always'`: highlight the first item as soon as the list opens.
     * @default false
     */
    autoHighlight?: boolean | 'always';
    /**
     * Whether the highlighted item should be preserved when the pointer leaves the list.
     * @default false
     */
    keepHighlight?: boolean;
    /**
     * Whether moving the pointer over items should highlight them.
     * @default true
     */
    highlightItemOnHover?: boolean;
    /**
     * The input value of the combobox. Use when controlled.
     */
    inputValue?: React.ComponentProps<'input'>['value'];
    /**
     * Callback fired when the input value of the combobox changes.
     */
    onInputValueChange?: (value: string, eventDetails: AriaCombobox.ChangeEventDetails) => void;
    /**
     * The uncontrolled input value when initially rendered.
     *
     * To render a controlled input, use the `inputValue` prop instead.
     */
    defaultInputValue?: React.ComponentProps<'input'>['defaultValue'];
    /**
     * A ref to imperative actions.
     * - `unmount`: When specified, the combobox will not be unmounted when closed.
     * Instead, the `unmount` function must be called to unmount the combobox manually.
     * Useful when the combobox's animation is controlled by an external library.
     */
    actionsRef?: React.RefObject<AriaCombobox.Actions>;
    /**
     * Callback fired when an item is highlighted or unhighlighted.
     * Receives the highlighted item value (or `undefined` if no item is highlighted) and event details
     * with a `reason` property describing why the highlight changed.
     * The `reason` can be:
     * - `'keyboard'`: the highlight changed due to keyboard navigation.
     * - `'pointer'`: the highlight changed due to pointer hovering.
     * - `'none'`: the highlight changed programmatically.
     */
    onItemHighlighted?: (itemValue: ItemValue | undefined, eventDetails: AriaCombobox.HighlightEventDetails) => void;
    /**
     * A ref to the hidden input element.
     */
    inputRef?: React.Ref<HTMLInputElement>;
    /**
     * Whether list items are presented in a grid layout.
     * When enabled, arrow keys navigate across rows and columns inferred from DOM rows.
     * @default false
     */
    grid?: boolean;
    /**
     * The items to be displayed in the list.
     * Can be either a flat array of items or an array of groups with items.
     */
    items?: readonly any[] | readonly Group<any>[];
    /**
     * Filtered items to display in the list.
     * When provided, the list will use these items instead of filtering the `items` prop internally.
     * Use when you want to control filtering logic externally with the `useFilter()` hook.
     */
    filteredItems?: readonly any[] | readonly Group<any>[];
    /**
     * Filter function used to match items vs input query.
     */
    filter?: null | ((itemValue: ItemValue, query: string, itemToString?: (itemValue: ItemValue) => string) => boolean);
    /**
     * When the item values are objects (`<Combobox.Item value={object}>`), this function converts the object
     * value to a string representation for display in the input.
     * If the shape of the object is `{ value, label }`, the label will be used automatically without needing
     * to specify this prop.
     */
    itemToStringLabel?: (itemValue: ItemValue) => string;
    /**
     * When the item values are objects (`<Combobox.Item value={object}>`), this function converts the object
     * value to a string representation for form submission.
     * If the shape of the object is `{ value, label }`, the value will be used automatically without needing
     * to specify this prop.
     */
    itemToStringValue?: (itemValue: ItemValue) => string;
    /**
     * Custom comparison logic used to determine if a combobox item value matches the current selected value.
     * Useful when item values are objects without matching referentially.
     * Defaults to `Object.is` comparison.
     */
    isItemEqualToValue?: (itemValue: ItemValue, selectedValue: ItemValue) => boolean;
    /**
     * Whether the items are being externally virtualized.
     * @default false
     */
    virtualized?: boolean;
    /**
     * Whether the list is rendered inline without using the popup.
     * @default false
     */
    inline?: boolean;
    /**
     * Determines if the popup enters a modal state when open.
     * - `true`: user interaction is limited to the popup: document page scroll is locked and pointer interactions
     *   on outside elements are disabled.
     * - `false`: user interaction with the rest of the document is allowed.
     * @default false
     */
    modal?: boolean;
    /**
     * The maximum number of items to display in the list.
     * @default -1
     */
    limit?: number;
    /**
     * Controls how the component behaves with respect to list filtering and inline autocompletion.
     * - `list` (default): items are dynamically filtered based on the input value. The input value does not change
     *   based on the active item.
     * - `both`: items are dynamically filtered based on the input value, which will temporarily change based on the
     *   active item (inline autocompletion).
     * - `inline`: items are static (not filtered), and the input value will temporarily change based on the active
     *   item (inline autocompletion).
     * - `none`: items are static (not filtered), and the input value will not change based on the active item.
     * @default 'list'
     */
    autoComplete?: 'list' | 'both' | 'inline' | 'none';
    /**
     * The locale to use for string comparison.
     * Defaults to the user's runtime locale.
     */
    locale?: Intl.LocalesArgument;
    /**
     * Whether clicking an item should submit the owning form.
     * @default false
     */
    submitOnItemClick?: boolean;
    /**
     * INTERNAL: When `selectionMode` is `none`, controls whether selecting an item fills the input.
     */
    fillInputOnItemPress?: boolean;
};

export type ComboboxRootConditionalProps<Value, Mode extends SelectionMode = 'none'> = Omit<
    ComboboxRootProps<Value>,
    'selectionMode' | 'selectedValue' | 'defaultSelectedValue' | 'onSelectedValueChange'
> & {
    /**
     * How the combobox should remember the selected value.
     * - `single`: Remembers the last selected value.
     * - `multiple`: Remember all selected values.
     * - `none`: Do not remember the selected value.
     * @default 'none'
     */
    selectionMode?: Mode;
    /**
     * The selected value of the combobox. Use when controlled.
     */
    selectedValue?: ComboboxItemValueType<Value, Mode>;
    /**
     * The uncontrolled selected value of the combobox when it's initially rendered.
     *
     * To render a controlled combobox, use the `selectedValue` prop instead.
     */
    defaultSelectedValue?: ComboboxItemValueType<Value, Mode> | null;
    /**
     * Callback fired when the selected value of the combobox changes.
     */
    onSelectedValueChange?: (value: ComboboxItemValueType<Value, Mode>, eventDetails: AriaCombobox.ChangeEventDetails) => void;
};

export namespace AriaCombobox {
    export type Props<Value, Mode extends SelectionMode = 'none'> = ComboboxRootConditionalProps<Value, Mode>;

    export type State = {};

    export type Actions = {
        unmount: () => void;
    };

    export type HighlightEventReason = 'keyboard' | 'pointer' | 'none';
    export type HighlightEventDetails = HeadlessUIGenericEventDetails<HighlightEventReason, { index: number }>;

    export type ChangeEventReason =
        | typeof REASONS.triggerPress
        | typeof REASONS.outsidePress
        | typeof REASONS.itemPress
        | typeof REASONS.escapeKey
        | typeof REASONS.listNavigation
        | typeof REASONS.focusOut
        | typeof REASONS.inputChange
        | typeof REASONS.inputClear
        | typeof REASONS.clearPress
        | typeof REASONS.chipRemovePress
        | typeof REASONS.none
        | (string & {});

    export type ChangeEventDetails = HeadlessUIChangeEventDetails<ChangeEventReason>;
}
