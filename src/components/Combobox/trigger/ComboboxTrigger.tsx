import React from 'react';

import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';
import { useStore } from '@flippo-ui/hooks/use-store';
import { useTimeout } from '@flippo-ui/hooks/use-timeout';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { getPseudoElementBounds } from '~@lib/getPseudoElementBounds';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { ownerDocument } from '~@lib/owner';
import { pressableTriggerOpenStateMapping } from '~@lib/popupStateMapping';
import { REASONS } from '~@lib/reason';
import { useClick, useTypeahead } from '~@packages/floating-ui-react';
import { contains, getTarget, stopEvent } from '~@packages/floating-ui-react/utils';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { fieldValidityMapping } from '../../Field/utils/constants';
import { useLabelableContext } from '../../LabelableProvider/LabelableContext';
import { useButton } from '../../use-button';
import {
    useComboboxFloatingContext,
    useComboboxInputValueContext,
    useComboboxRootContext
} from '../root/ComboboxRootContext';
import { selectors } from '../store';

import type { FieldRoot } from '../../Field/root/FieldRoot';

const BOUNDARY_OFFSET = 2;

const stateAttributesMapping: StateAttributesMapping<ComboboxTrigger.State> = {
    ...pressableTriggerOpenStateMapping,
    ...fieldValidityMapping
};

/**
 * A button that opens the popup.
 * Renders a `<button>` element.
 */
export function ComboboxTrigger(componentProps: ComboboxTrigger.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        nativeButton = true,
        disabled: disabledProp = false,
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
    const store = useComboboxRootContext();

    const selectionMode = useStore(store, selectors.selectionMode);
    const comboboxDisabled = useStore(store, selectors.disabled);
    const readOnly = useStore(store, selectors.readOnly);
    const listElement = useStore(store, selectors.listElement);
    const triggerProps = useStore(store, selectors.triggerProps);
    const triggerElement = useStore(store, selectors.triggerElement);
    const inputInsidePopup = useStore(store, selectors.inputInsidePopup);
    const open = useStore(store, selectors.open);
    const selectedValue = useStore(store, selectors.selectedValue);
    const activeIndex = useStore(store, selectors.activeIndex);
    const selectedIndex = useStore(store, selectors.selectedIndex);

    const floatingRootContext = useComboboxFloatingContext();
    const inputValue = useComboboxInputValueContext();

    const focusTimeout = useTimeout();

    const disabled = fieldDisabled || comboboxDisabled || disabledProp;

    const currentPointerTypeRef = React.useRef<PointerEvent['pointerType']>('');

    function trackPointerType(event: React.PointerEvent) {
        currentPointerTypeRef.current = event.pointerType;
    }

    const domReference = floatingRootContext.select('domReferenceElement');

    // Update the floating root context to use the trigger element when it differs from the current reference.
    // This ensures useClick and useTypeahead attach handlers to the correct element.
    React.useEffect(() => {
        if (!inputInsidePopup) {
            return;
        }
        if (triggerElement && triggerElement !== domReference) {
            floatingRootContext.set('domReferenceElement', triggerElement);
        }
    }, [triggerElement, domReference, floatingRootContext, inputInsidePopup]);

    const { reference: triggerTypeaheadProps } = useTypeahead(floatingRootContext, {
        enabled: !open && !readOnly && !comboboxDisabled && selectionMode === 'single',
        listRef: store.state.labelsRef,
        activeIndex,
        selectedIndex,
        onMatch(index) {
            const nextSelectedValue = store.state.valuesRef.current[index];
            if (nextSelectedValue !== undefined) {
                store.state.setSelectedValue(nextSelectedValue, createChangeEventDetails('none'));
            }
        }
    });

    const { reference: triggerClickProps } = useClick(floatingRootContext, {
        enabled: !readOnly && !comboboxDisabled,
        event: 'mousedown'
    });

    const { buttonRef, getButtonProps } = useButton({
        native: nativeButton,
        disabled
    });

    const state: ComboboxTrigger.State = React.useMemo(
        () => ({
            ...fieldState,
            open,
            disabled
        }),
        [fieldState, open, disabled]
    );

    const setTriggerElement = useStableCallback((element) => {
        store.set('triggerElement', element);
    });

    const element = useRenderElement('button', componentProps, {
        ref: [ref, buttonRef, setTriggerElement],
        state,
        props: [
            triggerProps,
            triggerClickProps,
            triggerTypeaheadProps,
            {
                'tabIndex': inputInsidePopup ? 0 : -1,
                disabled,
                'role': inputInsidePopup ? 'combobox' : undefined,
                'aria-expanded': open ? 'true' : 'false',
                'aria-haspopup': inputInsidePopup ? 'dialog' : 'listbox',
                'aria-controls': open ? listElement?.id : undefined,
                'aria-readonly': readOnly || undefined,
                'aria-labelledby': labelId,
                'onPointerDown': trackPointerType,
                'onPointerEnter': trackPointerType,
                onFocus() {
                    setFocused(true);

                    if (disabled || readOnly) {
                        return;
                    }

                    focusTimeout.start(0, store.state.forceMount);
                },
                onBlur() {
                    setTouched(true);
                    setFocused(false);

                    if (validationMode === 'onBlur') {
                        const valueToValidate = selectionMode === 'none' ? inputValue : selectedValue;
                        validation.commit(valueToValidate);
                    }
                },
                onMouseDown(event) {
                    if (disabled || readOnly) {
                        return;
                    }

                    if (!inputInsidePopup) {
                        floatingRootContext.set('domReferenceElement', event.currentTarget);
                    }

                    // Ensure items are registered for initial selection highlight.
                    store.state.forceMount();

                    if (currentPointerTypeRef.current !== 'touch') {
                        store.state.inputRef.current?.focus();

                        if (!inputInsidePopup) {
                            event.preventDefault();
                        }
                    }

                    if (open) {
                        return;
                    }

                    const doc = ownerDocument(event.currentTarget);

                    function handleMouseUp(mouseEvent: MouseEvent) {
                        if (!triggerElement) {
                            return;
                        }

                        const mouseUpTarget = getTarget(mouseEvent) as Element | null;
                        const positioner = store.state.positionerElement;
                        const list = store.state.listElement;

                        if (
                            contains(triggerElement, mouseUpTarget)
                            || contains(positioner, mouseUpTarget)
                            || contains(list, mouseUpTarget)
                            || mouseUpTarget === triggerElement
                        ) {
                            return;
                        }

                        const bounds = getPseudoElementBounds(triggerElement);

                        const withinHorizontal
              = mouseEvent.clientX >= bounds.left - BOUNDARY_OFFSET
                && mouseEvent.clientX <= bounds.right + BOUNDARY_OFFSET;
                        const withinVertical
              = mouseEvent.clientY >= bounds.top - BOUNDARY_OFFSET
                && mouseEvent.clientY <= bounds.bottom + BOUNDARY_OFFSET;

                        if (withinHorizontal && withinVertical) {
                            return;
                        }

                        store.state.setOpen(false, createChangeEventDetails('cancel-open', mouseEvent));
                    }

                    if (inputInsidePopup) {
                        doc.addEventListener('mouseup', handleMouseUp, { once: true });
                    }
                },
                onKeyDown(event) {
                    if (disabled || readOnly) {
                        return;
                    }

                    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                        stopEvent(event);
                        store.state.setOpen(
                            true,
                            createChangeEventDetails(REASONS.listNavigation, event.nativeEvent)
                        );
                        store.state.inputRef.current?.focus();
                    }
                }
            },
            validation ? validation.getValidationProps(elementProps) : elementProps,
            getButtonProps
        ],
        customStyleHookMapping: stateAttributesMapping
    });

    return element;
}

export type ComboboxTriggerState = {
    /**
     * Whether the popup is open.
     */
    open: boolean;
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
} & FieldRoot.State;

export type ComboboxTriggerProps = {
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
} & NativeButtonProps & HeadlessUIComponentProps<'button', ComboboxTrigger.State>;

export namespace ComboboxTrigger {
    export type State = ComboboxTriggerState;
    export type Props = ComboboxTriggerProps;
}
