import React from 'react';
import ReactDOM from 'react-dom';

import { useStore } from '@flippo-ui/hooks/use-store';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { REASONS } from '~@lib/reason';
import { stopEvent } from '~@packages/floating-ui-react/utils';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useCompositeListItem } from '../../Composite/list/useCompositeListItem';
import { useComboboxChipsContext } from '../chips/ComboboxChipsContext';
import { useComboboxRootContext } from '../root/ComboboxRootContext';
import { selectors } from '../store';

import { ComboboxChipContext } from './ComboboxChipContext';

import type { ComboboxChipContextValue } from './ComboboxChipContext';

/**
 * An individual chip that represents a value in a multiselectable input.
 * Renders a `<div>` element.
 */
export function ComboboxChip(componentProps: ComboboxChip.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref: refProp,
        ...elementProps
    } = componentProps;

    const store = useComboboxRootContext();
    const { setHighlightedChipIndex, chipsRef } = useComboboxChipsContext()!;

    const disabled = useStore(store, selectors.disabled);
    const readOnly = useStore(store, selectors.readOnly);
    const selectedValue = useStore(store, selectors.selectedValue);

    const { ref, index } = useCompositeListItem();

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        let nextIndex: number | undefined = index;

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            if (index > 0) {
                nextIndex = index - 1;
            }
            else {
                nextIndex = undefined;
            }
        }
        else if (event.key === 'ArrowRight') {
            event.preventDefault();
            if (index < selectedValue.length - 1) {
                nextIndex = index + 1;
            }
            else {
                nextIndex = undefined;
            }
        }
        else if (event.key === 'Backspace' || event.key === 'Delete') {
            const computedNextIndex
        = index >= selectedValue.length - 1 ? selectedValue.length - 2 : index;
            nextIndex = computedNextIndex >= 0 ? computedNextIndex : undefined;

            stopEvent(event);

            store.state.setIndices({ activeIndex: null, selectedIndex: null, type: 'keyboard' });
            store.state.setSelectedValue(
                selectedValue.filter((_: any, i: number) => i !== index),
                createChangeEventDetails(REASONS.none, event.nativeEvent)
            );
        }
        else if (event.key === 'Enter' || event.key === ' ') {
            stopEvent(event);
            nextIndex = undefined;
        }
        else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            stopEvent(event);
            store.state.setOpen(
                true,
                createChangeEventDetails(REASONS.listNavigation, event.nativeEvent)
            );
            nextIndex = undefined;
        }
        else if (
        // Check for printable characters (letters, numbers, symbols)
            event.key.length === 1
            && !event.ctrlKey
            && !event.metaKey
            && !event.altKey
        ) {
            nextIndex = undefined;
        }

        return nextIndex;
    }

    const state: ComboboxChip.State = React.useMemo(
        () => ({
            disabled
        }),
        [disabled]
    );

    const element = useRenderElement('div', componentProps, {
        ref: [refProp, ref],
        state,
        props: [{
            'tabIndex': -1,
            'aria-disabled': disabled || undefined,
            'aria-readonly': readOnly || undefined,
            onKeyDown(event) {
                if (disabled || readOnly) {
                    return;
                }

                const nextIndex = handleKeyDown(event);

                ReactDOM.flushSync(() => {
                    setHighlightedChipIndex(nextIndex);
                });

                if (nextIndex === undefined) {
                    store.state.inputRef.current?.focus();
                }
                else {
                    chipsRef.current[nextIndex]?.focus();
                }
            },
            onMouseDown(event) {
                if (disabled || readOnly) {
                    return;
                }
                event.preventDefault();
                store.state.inputRef.current?.focus();
            }
        }, elementProps]
    });

    const contextValue: ComboboxChipContextValue = React.useMemo(
        () => ({
            index
        }),
        [index]
    );

    return (
        <ComboboxChipContext.Provider value={contextValue}>{element}</ComboboxChipContext.Provider>
    );
}

export type ComboboxChipState = {
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
};

export type ComboboxChipProps = {} & HeadlessUIComponentProps<'div', ComboboxChip.State>;

export namespace ComboboxChip {
    export type State = ComboboxChipState;
    export type Props = ComboboxChipProps;
}
