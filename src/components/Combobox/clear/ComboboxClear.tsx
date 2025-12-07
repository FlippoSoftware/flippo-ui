import React from 'react';

import { useOpenChangeComplete } from '@flippo-ui/hooks/use-open-change-complete';
import { useStore } from '@flippo-ui/hooks/use-store';
import { useTransitionStatus } from '@flippo-ui/hooks/use-transition-status';

import type { TransitionStatus } from '@flippo-ui/hooks/use-transition-status';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { triggerOpenStateMapping } from '~@lib/popupStateMapping';
import { REASONS } from '~@lib/reason';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { useButton } from '../../use-button';
import { useComboboxInputValueContext, useComboboxRootContext } from '../root/ComboboxRootContext';
import { selectors } from '../store';

const stateAttributesMapping: StateAttributesMapping<ComboboxClear.State> = {
    ...transitionStatusMapping,
    ...triggerOpenStateMapping
};

/**
 * Clears the value when clicked.
 * Renders a `<button>` element.
 */
export function ComboboxClear(componentProps: ComboboxClear.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled: disabledProp = false,
        nativeButton = true,
        keepMounted = false,
        ref,
        ...elementProps
    } = componentProps;

    const { disabled: fieldDisabled } = useFieldRootContext();
    const store = useComboboxRootContext();

    const selectionMode = useStore(store, selectors.selectionMode);
    const comboboxDisabled = useStore(store, selectors.disabled);
    const readOnly = useStore(store, selectors.readOnly);
    const open = useStore(store, selectors.open);
    const selectedValue = useStore(store, selectors.selectedValue);

    const inputValue = useComboboxInputValueContext();

    let visible = false;
    if (selectionMode === 'none') {
        visible = inputValue !== '';
    }
    else if (selectionMode === 'single') {
        visible = selectedValue != null;
    }
    else {
        visible = Array.isArray(selectedValue) && selectedValue.length > 0;
    }

    const disabled = fieldDisabled || comboboxDisabled || disabledProp;

    const { buttonRef, getButtonProps } = useButton({
        native: nativeButton,
        disabled
    });

    const { mounted, transitionStatus, setMounted } = useTransitionStatus(visible);

    const state: ComboboxClear.State = React.useMemo(
        () => ({
            disabled,
            open,
            transitionStatus
        }),
        [disabled, open, transitionStatus]
    );

    useOpenChangeComplete({
        open: visible,
        ref: store.state.clearRef,
        onComplete() {
            if (!visible) {
                setMounted(false);
            }
        }
    });

    const element = useRenderElement('button', componentProps, {
        state,
        ref: [ref, buttonRef, store.state.clearRef],
        props: [{
            'tabIndex': -1,
            'children': 'x',
            disabled,
            'aria-readonly': readOnly || undefined,
            // Avoid stealing focus from the input.
            onMouseDown(event) {
                event.preventDefault();
            },
            onClick(event) {
                if (disabled || readOnly) {
                    return;
                }

                const keyboardActiveRef = store.state.keyboardActiveRef;

                store.state.setInputValue(
                    '',
                    createChangeEventDetails(REASONS.clearPress, event.nativeEvent)
                );

                if (selectionMode !== 'none') {
                    store.state.setSelectedValue(
                        Array.isArray(selectedValue) ? [] : null,
                        createChangeEventDetails(REASONS.clearPress, event.nativeEvent)
                    );
                    store.state.setIndices({
                        activeIndex: null,
                        selectedIndex: null,
                        type: keyboardActiveRef.current ? 'keyboard' : 'pointer'
                    });
                }
                else {
                    store.state.setIndices({
                        activeIndex: null,
                        type: keyboardActiveRef.current ? 'keyboard' : 'pointer'
                    });
                }

                store.state.inputRef.current?.focus();
            }
        }, elementProps, getButtonProps],
        customStyleHookMapping: stateAttributesMapping
    });

    const shouldRender = keepMounted || mounted;
    if (!shouldRender) {
        return null;
    }

    return element;
}

export type ComboboxClearState = {
    /**
     * Whether the popup is open.
     */
    open: boolean;
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
    transitionStatus: TransitionStatus;
};

export type ComboboxClearProps = {
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * Whether the component should remain mounted in the DOM when not visible.
     * @default false
     */
    keepMounted?: boolean;
} & NativeButtonProps & HeadlessUIComponentProps<'button', ComboboxClear.State>;

export namespace ComboboxClear {
    export type State = ComboboxClearState;
    export type Props = ComboboxClearProps;
}
