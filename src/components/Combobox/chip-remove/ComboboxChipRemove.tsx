import React from 'react';

import { useStore } from '@flippo-ui/hooks/use-store';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { findItemIndex } from '~@lib/itemEquality';
import { REASONS } from '~@lib/reason';
import { stopEvent } from '~@packages/floating-ui-react/utils';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useButton } from '../../use-button';
import { useComboboxChipContext } from '../chip/ComboboxChipContext';
import { useComboboxRootContext } from '../root/ComboboxRootContext';
import { selectors } from '../store';

/**
 * A button to remove a chip.
 * Renders a `<button>` element.
 */
export function ComboboxChipRemove(componentProps: ComboboxChipRemove.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        nativeButton = true,
        ref,
        ...elementProps
    } = componentProps;

    const store = useComboboxRootContext();
    const { index } = useComboboxChipContext();

    const disabled = useStore(store, selectors.disabled);
    const readOnly = useStore(store, selectors.readOnly);
    const selectedValue = useStore(store, selectors.selectedValue);
    const isItemEqualToValue = useStore(store, selectors.isItemEqualToValue);

    const { buttonRef, getButtonProps } = useButton({
        native: nativeButton,
        disabled: disabled || readOnly,
        focusableWhenDisabled: true
    });

    const state: ComboboxChipRemove.State = React.useMemo(
        () => ({
            disabled
        }),
        [disabled]
    );

    const element = useRenderElement('button', componentProps, {
        ref: [ref, buttonRef],
        state,
        props: [{
            'tabIndex': -1,
            disabled,
            'aria-readonly': readOnly || undefined,
            onClick(event) {
                if (disabled || readOnly) {
                    return;
                }

                const eventDetails = createChangeEventDetails(REASONS.chipRemovePress, event.nativeEvent);

                // If the removed chip was the active item, clear highlight
                const activeIndex = store.state.activeIndex;
                const removedItem = selectedValue[index];

                // Try current visible list first; if not found, it's filtered out. No need
                // to clear highlight in that case since it can't equal activeIndex.
                const removedIndex = findItemIndex(
                    store.state.valuesRef.current,
                    removedItem,
                    isItemEqualToValue
                );
                if (removedIndex !== -1 && activeIndex === removedIndex) {
                    store.state.setIndices({
                        activeIndex: null,
                        type: store.state.keyboardActiveRef.current ? 'pointer' : 'keyboard'
                    });
                }

                store.state.setSelectedValue(
                    selectedValue.filter((_: any, i: number) => i !== index),
                    eventDetails
                );

                if (!eventDetails.isPropagationAllowed) {
                    event.stopPropagation();
                }

                store.state.inputRef.current?.focus();
            },
            onKeyDown(event) {
                if (disabled || readOnly) {
                    return;
                }

                const eventDetails = createChangeEventDetails(REASONS.chipRemovePress, event.nativeEvent);

                if (event.key === 'Enter' || event.key === ' ') {
                    // If the removed chip was the active item, clear highlight
                    const activeIndex = store.state.activeIndex;
                    const removedItem = selectedValue[index];
                    const removedIndex = findItemIndex(
                        store.state.valuesRef.current,
                        removedItem,
                        isItemEqualToValue
                    );

                    if (removedIndex !== -1 && activeIndex === removedIndex) {
                        store.state.setIndices({
                            activeIndex: null,
                            type: store.state.keyboardActiveRef.current ? 'pointer' : 'keyboard'
                        });
                    }

                    store.state.setSelectedValue(
                        selectedValue.filter((_: any, i: number) => i !== index),
                        eventDetails
                    );

                    if (!eventDetails.isPropagationAllowed) {
                        stopEvent(event);
                    }

                    store.state.inputRef.current?.focus();
                }
            }
        }, elementProps, getButtonProps]
    });

    return element;
}

export type ComboboxChipRemoveState = {
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
};

export type ComboboxChipRemoveProps = {} & NativeButtonProps & HeadlessUIComponentProps<'button', ComboboxChipRemove.State>;

export namespace ComboboxChipRemove {
    export type State = ComboboxChipRemoveState;
    export type Props = ComboboxChipRemoveProps;
}
