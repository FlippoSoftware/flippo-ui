import React from 'react';

import {
    useIsoLayoutEffect,
    useLatestRef,
    useStore,
    useTimeout
} from '@flippo-ui/hooks';
import { useValueAsRef } from '@flippo-ui/hooks/use-value-as-ref';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useRenderElement } from '~@lib/hooks';
import { isMouseWithinBounds } from '~@lib/isMouseWithinBounds';
import { compareItemEquality, itemIncludes, removeItem } from '~@lib/itemEquality';
import { REASONS } from '~@lib/reason';

import type { HeadlessUIComponentProps, HTMLProps, NonNativeButtonProps } from '~@lib/types';

import {
    IndexGuessBehavior,
    useCompositeListItem
} from '../../Composite/list/useCompositeListItem';
import { useButton } from '../../use-button';
import { useSelectRootContext } from '../root/SelectRootContext';
import { selectors } from '../store';

import { SelectItemContext } from './SelectItemContext';

import type { SelectItemContextValue } from './SelectItemContext';

/**
 * An individual option in the select menu.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export const Inner = React.memo(
    (
        componentProps: SelectItem.Props
    ) => {
        const {
            /* eslint-disable unused-imports/no-unused-vars */
            render,
            className,
            /* eslint-enable unused-imports/no-unused-vars */
            value = null,
            label,
            disabled = false,
            nativeButton = false,
            ref,
            ...elementProps
        } = componentProps;

        const textRef = React.useRef<HTMLElement | null>(null);
        const listItem = useCompositeListItem({
            label,
            textRef,
            indexGuessBehavior: IndexGuessBehavior.GuessFromOrder
        });

        const {
            store,
            getItemProps,
            setOpen,
            setValue,
            selectionRef,
            typingRef,
            valuesRef,
            keyboardActiveRef,
            multiple
        } = useSelectRootContext();

        const highlightTimeout = useTimeout();

        const highlighted = useStore(store, selectors.isActive, listItem.index);
        const selected = useStore(store, selectors.isSelected, listItem.index, value);
        const selectedByFocus = useStore(store, selectors.isSelectedByFocus, listItem.index);
        const isItemEqualToValue = useStore(store, selectors.isItemEqualToValue);

        const index = listItem.index;
        const hasRegistered = index !== -1;

        const itemRef = React.useRef<HTMLDivElement | null>(null);
        const indexRef = useValueAsRef(index);

        useIsoLayoutEffect(() => {
            if (!hasRegistered) {
                return undefined;
            }

            const values = valuesRef.current;
            values[index] = value;

            return () => {
                delete values[index];
            };
        }, [hasRegistered, index, value, valuesRef]);

        useIsoLayoutEffect(() => {
            if (!hasRegistered) {
                return undefined;
            }

            const selectedValue = store.state.value;

            let candidate = selectedValue;
            if (multiple && Array.isArray(selectedValue) && selectedValue.length > 0) {
                candidate = selectedValue[selectedValue.length - 1];
            }

            if (candidate !== undefined && compareItemEquality(candidate, value, isItemEqualToValue)) {
                store.set('selectedIndex', index);
            }
            return undefined;
        }, [
            hasRegistered,
            index,
            multiple,
            isItemEqualToValue,
            store,
            value
        ]);

        const state: SelectItem.State = React.useMemo(
            () => ({
                disabled,
                selected,
                highlighted
            }),
            [disabled, selected, highlighted]
        );

        const rootProps = getItemProps({ active: highlighted, selected });
        // With our custom `focusItemOnHover` implementation, this interferes with the logic and can
        // cause the index state to be stuck when leaving the select popup.
        rootProps.onFocus = undefined;
        rootProps.id = undefined;

        const lastKeyRef = React.useRef<string | null>(null);
        const pointerTypeRef = React.useRef<'mouse' | 'touch' | 'pen'>('mouse');
        const didPointerDownRef = React.useRef(false);

        const { getButtonProps, buttonRef } = useButton({
            disabled,
            focusableWhenDisabled: true,
            native: nativeButton
        });

        function commitSelection(event: MouseEvent) {
            const selectedValue = store.state.value;
            if (multiple) {
                const currentValue = Array.isArray(selectedValue) ? selectedValue : [];
                const nextValue = selected
                    ? removeItem(currentValue, value, isItemEqualToValue)
                    : [...currentValue, value];
                setValue(nextValue, createChangeEventDetails(REASONS.itemPress, event));
            }
            else {
                setValue(value, createChangeEventDetails(REASONS.itemPress, event));
                setOpen(false, createChangeEventDetails(REASONS.itemPress, event));
            }
        }

        const defaultProps: HTMLProps = {
            'role': 'option',
            'aria-selected': selected,
            'aria-disabled': disabled || undefined,
            'tabIndex': highlighted ? 0 : -1,
            onFocus() {
                store.set('activeIndex', index);
            },
            onMouseEnter() {
                if (!keyboardActiveRef.current && store.state.selectedIndex === null) {
                    store.set('activeIndex', index);
                }
            },
            onMouseMove() {
                store.set('activeIndex', index);
            },
            onMouseLeave(event) {
                if (keyboardActiveRef.current || isMouseWithinBounds(event)) {
                    return;
                }

                highlightTimeout.start(0, () => {
                    if (store.state.activeIndex === index) {
                        store.set('activeIndex', null);
                    }
                });
            },
            onTouchStart() {
                selectionRef.current = {
                    allowSelectedMouseUp: false,
                    allowUnselectedMouseUp: false
                };
            },
            onKeyDown(event) {
                lastKeyRef.current = event.key;
                store.set('activeIndex', index);
            },
            onClick(event) {
                didPointerDownRef.current = false;

                // Prevent double commit on {Enter}
                if (event.type === 'keydown' && lastKeyRef.current === null) {
                    return;
                }

                if (
                    disabled
                    || (lastKeyRef.current === ' ' && typingRef.current)
                    || (pointerTypeRef.current !== 'touch' && !highlighted)
                ) {
                    return;
                }

                lastKeyRef.current = null;
                commitSelection(event.nativeEvent);
            },
            onPointerEnter(event) {
                pointerTypeRef.current = event.pointerType;
            },
            onPointerDown(event) {
                pointerTypeRef.current = event.pointerType;
                didPointerDownRef.current = true;
            },
            onMouseUp(event) {
                if (disabled) {
                    return;
                }

                if (didPointerDownRef.current) {
                    didPointerDownRef.current = false;
                    return;
                }

                const disallowSelectedMouseUp = !selectionRef.current.allowSelectedMouseUp && selected;
                const disallowUnselectedMouseUp = !selectionRef.current.allowUnselectedMouseUp && !selected;

                if (
                    disallowSelectedMouseUp
                    || disallowUnselectedMouseUp
                    || (pointerTypeRef.current !== 'touch' && !highlighted)
                ) {
                    return;
                }

                commitSelection(event.nativeEvent);
            }
        };

        const element = useRenderElement('div', componentProps, {
            ref: [buttonRef, ref, listItem.ref, itemRef],
            state,
            props: [rootProps, defaultProps, elementProps, getButtonProps]
        });

        const contextValue: SelectItemContextValue = React.useMemo(
            () => ({
                selected,
                indexRef,
                textRef,
                selectedByFocus,
                hasRegistered
            }),
            [
                selected,
                indexRef,
                textRef,
                selectedByFocus,
                hasRegistered
            ]
        );

        return <SelectItemContext.Provider value={contextValue}>{element}</SelectItemContext.Provider>;
    }
);

export function SelectItem(componentProps: SelectItem.Props) {
    return <Inner {...componentProps} />;
}

export type SelectItemState = {
    /**
     * Whether the item should ignore user interaction.
     */
    disabled: boolean;
    /**
     * Whether the item is selected.
     */
    selected: boolean;
    /**
     * Whether the item is highlighted.
     */
    highlighted: boolean;
};

export type SelectItemProps = {
    children?: React.ReactNode;
    /**
     * A unique value that identifies this select item.
     * @default null
     */
    value?: any;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * Specifies the text label to use when the item is matched during keyboard text navigation.
     *
     * Defaults to the item text content if not provided.
     */
    label?: string;
} & NonNativeButtonProps & Omit<HeadlessUIComponentProps<'div', SelectItem.State>, 'id'>;

export namespace SelectItem {
    export type State = SelectItemState;
    export type Props = SelectItemProps;
}
