import React from 'react';

import { useEventCallback } from '@flippo-ui/hooks/use-event-callback';
import { useStore } from '@flippo-ui/hooks/use-store';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { isAndroid, isFirefox } from '~@lib/detectBrowser';
import { useDirection } from '~@lib/hooks/useDirection';
import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { pressableTriggerOpenStateMapping } from '~@lib/popupStateMapping';
import { REASONS } from '~@lib/reason';
import { stopEvent } from '~@packages/floating-ui-react/utils';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { Side } from '~@lib/hooks/useAnchorPositioning';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { fieldValidityMapping } from '../../Field/utils/constants';
import { useLabelableContext } from '../../LabelableProvider/LabelableContext';
import { useComboboxChipsContext } from '../chips/ComboboxChipsContext';
import { useComboboxPositionerContext } from '../positioner/ComboboxPositionerContext';
import {
    useComboboxDerivedItemsContext,
    useComboboxInputValueContext,
    useComboboxRootContext
} from '../root/ComboboxRootContext';
import { selectors } from '../store';

import type { FieldRoot } from '../../Field/root/FieldRoot';

const stateAttributesMapping: StateAttributesMapping<ComboboxInput.State> = {
    ...pressableTriggerOpenStateMapping,
    ...fieldValidityMapping,
    popupSide: (side) => (side ? { 'data-popup-side': side } : null),
    listEmpty: (empty) => (empty ? { 'data-list-empty': '' } : null)
};

/**
 * A text input to search for items in the list.
 * Renders an `<input>` element.
 */
export function ComboboxInput(componentProps: ComboboxInput.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled: disabledProp = false,
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;

    const {
        state: fieldState,
        disabled: fieldDisabled,
        setTouched,
        setFocused,
        validationMode,
        validation
    } = useFieldRootContext();
    const { labelId } = useLabelableContext();
    const comboboxChipsContext = useComboboxChipsContext();
    const positioning = useComboboxPositionerContext(true);
    const hasPositionerParent = Boolean(positioning);
    const store = useComboboxRootContext();
    const { filteredItems } = useComboboxDerivedItemsContext();
    // `inputValue` can't be placed in the store.
    // https://github.com/mui/base-ui/issues/2703
    const inputValue = useComboboxInputValueContext();

    const id = useHeadlessUiId(idProp);
    const direction = useDirection();

    const comboboxDisabled = useStore(store, selectors.disabled);
    const readOnly = useStore(store, selectors.readOnly);
    const name = useStore(store, selectors.name);
    const selectionMode = useStore(store, selectors.selectionMode);
    const autoHighlightMode = useStore(store, selectors.autoHighlight);
    const inputProps = useStore(store, selectors.inputProps);
    const triggerProps = useStore(store, selectors.triggerProps);
    const open = useStore(store, selectors.open);
    const mounted = useStore(store, selectors.mounted);
    const selectedValue = useStore(store, selectors.selectedValue);
    const popupSideValue = useStore(store, selectors.popupSide);
    const positionerElement = useStore(store, selectors.positionerElement);

    const autoHighlightEnabled = Boolean(autoHighlightMode);
    const popupSide = mounted && positionerElement ? popupSideValue : null;
    const disabled = fieldDisabled || comboboxDisabled || disabledProp;
    const listEmpty = filteredItems.length === 0;

    const [composingValue, setComposingValue] = React.useState<string | null>(null);
    const isComposingRef = React.useRef(false);

    const setInputElement = useEventCallback((element: HTMLInputElement | null) => {
        const isInsidePopup = hasPositionerParent || store.state.inline;

        if (isInsidePopup && !store.state.hasInputValue) {
            store.state.setInputValue('', createChangeEventDetails(REASONS.none));
        }

        store.update({
            inputElement: element,
            inputInsidePopup: isInsidePopup
        });
    });

    const state: ComboboxInput.State = React.useMemo(
        () => ({
            ...fieldState,
            open,
            disabled,
            readOnly,
            popupSide,
            listEmpty
        }),
        [
            fieldState,
            open,
            disabled,
            readOnly,
            popupSide,
            listEmpty
        ]
    );

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (!comboboxChipsContext) {
            return undefined;
        }

        let nextIndex: number | undefined;

        const { highlightedChipIndex } = comboboxChipsContext;

        if (highlightedChipIndex !== undefined) {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                if (highlightedChipIndex > 0) {
                    nextIndex = highlightedChipIndex - 1;
                }
                else {
                    nextIndex = undefined;
                }
            }
            else if (event.key === 'ArrowRight') {
                event.preventDefault();
                if (highlightedChipIndex < selectedValue.length - 1) {
                    nextIndex = highlightedChipIndex + 1;
                }
                else {
                    nextIndex = undefined;
                }
            }
            else if (event.key === 'Backspace' || event.key === 'Delete') {
                event.preventDefault();
                // Move highlight appropriately after removal.
                const computedNextIndex
          = highlightedChipIndex >= selectedValue.length - 1
              ? selectedValue.length - 2
              : highlightedChipIndex;
                // If the computed index is negative, treat it as no highlight.
                nextIndex = computedNextIndex >= 0 ? computedNextIndex : undefined;
                store.state.setIndices({ activeIndex: null, selectedIndex: null, type: 'keyboard' });
            }
            return nextIndex;
        }

        // Handle navigation when no chip is highlighted
        if (
            event.key === 'ArrowLeft'
            && (event.currentTarget.selectionStart ?? 0) === 0
            && selectedValue.length > 0
        ) {
            event.preventDefault();
            const lastChipIndex = Math.max(selectedValue.length - 1, 0);
            nextIndex = lastChipIndex;
        }
        else if (
            event.key === 'Backspace'
            && event.currentTarget.value === ''
            && selectedValue.length > 0
        ) {
            store.state.setIndices({ activeIndex: null, selectedIndex: null, type: 'keyboard' });
            event.preventDefault();
        }

        return nextIndex;
    }

    const element = useRenderElement('input', componentProps, {
        state,
        ref: [ref, store.state.inputRef, setInputElement],
        props: [inputProps, triggerProps, {
            'type': 'text',
            'value': componentProps.value ?? composingValue ?? inputValue,
            'aria-readonly': readOnly || undefined,
            'aria-labelledby': labelId,
            disabled,
            readOnly,
            ...(selectionMode === 'none' && name && { name }),
            id,
            onFocus() {
                setFocused(true);
            },
            onBlur() {
                setTouched(true);
                setFocused(false);

                if (validationMode === 'onBlur') {
                    const valueToValidate = selectionMode === 'none' ? inputValue : selectedValue;
                    validation.commit(valueToValidate);
                }
            },
            onCompositionStart(event) {
                if (isAndroid) {
                    return;
                }
                isComposingRef.current = true;
                setComposingValue(event.currentTarget.value);
            },
            onCompositionEnd(event) {
                isComposingRef.current = false;
                const next = event.currentTarget.value;
                setComposingValue(null);
                store.state.setInputValue(
                    next,
                    createChangeEventDetails(REASONS.inputChange, event.nativeEvent)
                );
            },
            onChange(event: React.ChangeEvent<HTMLInputElement>) {
                // During IME composition, avoid propagating controlled updates to prevent
                // filtering the options prematurely so `Empty` won't show incorrectly.
                // We can't rely on this check for Android due to how it handles composition
                // events with some keyboards (e.g. Samsung keyboard with predictive text on
                // treats all text as always-composing).
                // https://github.com/mui/base-ui/issues/2942
                if (isComposingRef.current) {
                    const nextVal = event.currentTarget.value;
                    setComposingValue(nextVal);

                    if (nextVal === '' && !store.state.openOnInputClick && !store.state.inputInsidePopup) {
                        store.state.setOpen(
                            false,
                            createChangeEventDetails(REASONS.inputClear, event.nativeEvent)
                        );
                    }

                    const trimmed = nextVal.trim();
                    const shouldMaintainHighlight = autoHighlightEnabled && trimmed !== '';

                    if (!readOnly && !disabled) {
                        if (trimmed !== '') {
                            store.state.setOpen(
                                true,
                                createChangeEventDetails(REASONS.inputChange, event.nativeEvent)
                            );
                            if (!autoHighlightEnabled) {
                                store.state.setIndices({
                                    activeIndex: null,
                                    selectedIndex: null,
                                    type: store.state.keyboardActiveRef.current ? 'keyboard' : 'pointer'
                                });
                            }
                        }
                    }

                    if (open && store.state.activeIndex !== null && !shouldMaintainHighlight) {
                        store.state.setIndices({
                            activeIndex: null,
                            selectedIndex: null,
                            type: store.state.keyboardActiveRef.current ? 'keyboard' : 'pointer'
                        });
                    }

                    return;
                }

                store.state.setInputValue(
                    event.currentTarget.value,
                    createChangeEventDetails(REASONS.inputChange, event.nativeEvent)
                );

                const empty = event.currentTarget.value === '';
                const clearDetails = createChangeEventDetails(REASONS.inputClear, event.nativeEvent);

                if (empty && !store.state.inputInsidePopup) {
                    if (selectionMode === 'single') {
                        store.state.setSelectedValue(null, clearDetails);
                    }

                    if (!store.state.openOnInputClick) {
                        store.state.setOpen(false, clearDetails);
                    }
                }

                const trimmed = event.currentTarget.value.trim();
                if (!readOnly && !disabled) {
                    if (trimmed !== '') {
                        store.state.setOpen(
                            true,
                            createChangeEventDetails(REASONS.inputChange, event.nativeEvent)
                        );
                        // When autoHighlight is enabled, keep the highlight (will be set to 0 in root).
                        if (!autoHighlightEnabled) {
                            store.state.setIndices({
                                activeIndex: null,
                                selectedIndex: null,
                                type: store.state.keyboardActiveRef.current ? 'keyboard' : 'pointer'
                            });
                        }
                    }
                }

                // When the user types, ensure the list resets its highlight so that
                // virtual focus returns to the input (aria-activedescendant is
                // cleared).
                if (open && store.state.activeIndex !== null && !autoHighlightEnabled) {
                    store.state.setIndices({
                        activeIndex: null,
                        selectedIndex: null,
                        type: store.state.keyboardActiveRef.current ? 'keyboard' : 'pointer'
                    });
                }
            },
            onKeyDown(event) {
                if (disabled || readOnly) {
                    return;
                }

                if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
                    return;
                }

                store.state.keyboardActiveRef.current = true;
                const input = event.currentTarget;
                const scrollAmount = input.scrollWidth - input.clientWidth;
                const isRTL = direction === 'rtl';

                if (event.key === 'Home') {
                    stopEvent(event);
                    const cursor = isFirefox && isRTL ? input.value.length : 0;
                    input.setSelectionRange(cursor, cursor);
                    input.scrollLeft = 0;
                    return;
                }

                if (event.key === 'End') {
                    stopEvent(event);
                    const cursor = isFirefox && isRTL ? 0 : input.value.length;
                    input.setSelectionRange(cursor, cursor);
                    input.scrollLeft = isRTL ? -scrollAmount : scrollAmount;
                    return;
                }

                if (!mounted && event.key === 'Escape') {
                    const isClear
              = selectionMode === 'multiple' && Array.isArray(selectedValue)
                  ? selectedValue.length === 0
                  : selectedValue === null;

                    const details = createChangeEventDetails(REASONS.escapeKey, event.nativeEvent);
                    const value = selectionMode === 'multiple' ? [] : null;
                    store.state.setInputValue('', details);
                    store.state.setSelectedValue(value, details);

                    if (!isClear && !store.state.inline && !details.isPropagationAllowed) {
                        event.stopPropagation();
                    }

                    return;
                }

                // Handle deletion when no chip is highlighted and the input is empty.
                if (
                    comboboxChipsContext
                    && event.key === 'Backspace'
                    && input.value === ''
                    && comboboxChipsContext.highlightedChipIndex === undefined
                    && Array.isArray(selectedValue)
                    && selectedValue.length > 0
                ) {
                    const newValue = selectedValue.slice(0, -1);
                    // If the removed item was also the active (highlighted) item, clear highlight
                    store.state.setIndices({
                        activeIndex: null,
                        selectedIndex: null,
                        type: store.state.keyboardActiveRef.current ? 'keyboard' : 'pointer'
                    });
                    store.state.setSelectedValue(
                        newValue,
                        createChangeEventDetails(REASONS.none, event.nativeEvent)
                    );
                    return;
                }

                const nextIndex = handleKeyDown(event);

                comboboxChipsContext?.setHighlightedChipIndex(nextIndex);

                if (nextIndex !== undefined) {
                    comboboxChipsContext?.chipsRef.current[nextIndex]?.focus();
                }
                else {
                    store.state.inputRef.current?.focus();
                }

                // event.isComposing
                if (event.which === 229) {
                    return;
                }

                if (event.key === 'Enter' && open) {
                    const activeIndex = store.state.activeIndex;
                    const nativeEvent = event.nativeEvent;

                    if (activeIndex === null) {
                        // Allow form submission when no item is highlighted.
                        store.state.setOpen(false, createChangeEventDetails(REASONS.none, nativeEvent));
                        return;
                    }

                    stopEvent(event);

                    const listItem = store.state.listRef.current[activeIndex];

                    if (listItem) {
                        store.state.selectionEventRef.current = nativeEvent;
                        listItem.click();
                        store.state.selectionEventRef.current = null;
                    }
                }
            },
            onPointerMove() {
                store.state.keyboardActiveRef.current = false;
            },
            onPointerDown() {
                store.state.keyboardActiveRef.current = false;
            }
        }, validation ? validation.getValidationProps(elementProps) : elementProps],
        customStyleHookMapping: stateAttributesMapping
    });

    return element;
}

export type ComboboxInputState = {
    /**
     * Whether the corresponding popup is open.
     */
    open: boolean;
    /**
     * Indicates which side the corresponding popup is positioned relative to its anchor.
     */
    popupSide: Side | null;
    /**
     * Present when the corresponding items list is empty.
     */
    listEmpty: boolean;
    /**
     * Whether the component should ignore user edits.
     */
    readOnly: boolean;
} & FieldRoot.State;

export type ComboboxInputProps = {
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
} & HeadlessUIComponentProps<'input', ComboboxInput.State>;

export namespace ComboboxInput {
    export type State = ComboboxInputState;
    export type Props = ComboboxInputProps;
}
