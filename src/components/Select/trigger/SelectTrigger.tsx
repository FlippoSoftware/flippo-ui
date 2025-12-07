import React from 'react';

import {
    useEventCallback,
    useLatestRef,
    useMergedRef,
    useStore,
    useTimeout
} from '@flippo-ui/hooks';
import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';
import { useValueAsRef } from '@flippo-ui/hooks/use-value-as-ref';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { getPseudoElementBounds } from '~@lib/getPseudoElementBounds';
import { useRenderElement } from '~@lib/hooks';
import { mergeProps } from '~@lib/merge';
import { ownerDocument } from '~@lib/owner';
import { pressableTriggerOpenStateMapping } from '~@lib/popupStateMapping';
import { REASONS } from '~@lib/reason';
import { contains, getFloatingFocusElement } from '~@packages/floating-ui-react/utils';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type {
    HeadlessUIComponentProps,
    HTMLProps,
    NativeButtonProps,
    NonNativeButtonProps
} from '~@lib/types';

import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { fieldValidityMapping } from '../../Field/utils/constants';
import { useLabelableContext } from '../../LabelableProvider';
import { useButton } from '../../use-button';
import { useSelectRootContext } from '../root/SelectRootContext';
import { selectors } from '../store';

import type { FieldRoot } from '../../Field/root/FieldRoot';

const BOUNDARY_OFFSET = 2;

const customStyleHookMapping: StateAttributesMapping<SelectTrigger.State> = {
    ...pressableTriggerOpenStateMapping,
    ...fieldValidityMapping,
    value: () => null
};

/**
 * A button that opens the select menu.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectTrigger(componentProps: SelectTrigger.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        disabled: disabledProp = false,
        nativeButton = true,
        ...elementProps
    } = componentProps;

    const {
        setTouched,
        setFocused,
        validationMode,
        state: fieldState,
        disabled: fieldDisabled
    } = useFieldRootContext();
    const { labelId } = useLabelableContext();
    const {
        store,
        setOpen,
        selectionRef,
        validation,
        readOnly,
        alignItemWithTriggerActiveRef,
        disabled: selectDisabled,
        keyboardActiveRef
    } = useSelectRootContext();

    const disabled = fieldDisabled || selectDisabled || disabledProp;

    const open = useStore(store, selectors.open);
    const value = useStore(store, selectors.value);
    const triggerProps = useStore(store, selectors.triggerProps);
    const positionerElement = useStore(store, selectors.positionerElement);
    const listElement = useStore(store, selectors.listElement);
    const serializedValue = useStore(store, selectors.serializedValue);

    const positionerRef = useValueAsRef(positionerElement);

    const triggerRef = React.useRef<HTMLElement | null>(null);
    const timeoutFocus = useTimeout();
    const timeoutMouseDown = useTimeout();

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const setTriggerElement = useStableCallback((element) => {
        store.set('triggerElement', element);
    });

    const mergedRef = useMergedRef<HTMLElement>(
        ref,
        triggerRef,
        buttonRef,
        setTriggerElement
    );

    const timeout1 = useTimeout();
    const timeout2 = useTimeout();

    React.useEffect(() => {
        if (open) {
            // mousedown -> move to unselected item -> mouseup should not select within 200ms.
            timeout2.start(200, () => {
                selectionRef.current.allowUnselectedMouseUp = true;

                // mousedown -> mouseup on selected item should not select within 400ms.
                timeout1.start(200, () => {
                    selectionRef.current.allowSelectedMouseUp = true;
                });
            });

            return () => {
                timeout1.clear();
                timeout2.clear();
            };
        }

        selectionRef.current = {
            allowSelectedMouseUp: false,
            allowUnselectedMouseUp: false
        };

        timeoutMouseDown.clear();

        return undefined;
    }, [
        open,
        selectionRef,
        timeoutMouseDown,
        timeout1,
        timeout2
    ]);

    const ariaControlsId = React.useMemo(() => {
        return listElement?.id ?? getFloatingFocusElement(positionerElement)?.id;
    }, [listElement, positionerElement]);

    const props: HTMLProps = mergeProps<'button'>(
        triggerProps,
        {
            'role': 'combobox',
            'aria-expanded': open ? 'true' : 'false',
            'aria-haspopup': 'listbox',
            'aria-controls': open ? ariaControlsId : undefined,
            'aria-labelledby': labelId,
            'aria-readonly': readOnly || undefined,
            'tabIndex': disabled ? -1 : 0,
            'ref': mergedRef,
            onFocus(event) {
                setFocused(true);
                // The popup element shouldn't obscure the focused trigger.
                if (open && alignItemWithTriggerActiveRef.current) {
                    setOpen(false, createChangeEventDetails(REASONS.focusOut, event.nativeEvent));
                }

                // Saves a re-render on initial click: `forceMount === true` mounts
                // the items before `open === true`. We could sync those cycles better
                // without a timeout, but this is enough for now.
                //
                // XXX: might be causing `act()` warnings.
                timeoutFocus.start(0, () => {
                    store.set('forceMount', true);
                });
            },
            onBlur() {
                setTouched(true);
                setFocused(false);

                if (validationMode === 'onBlur') {
                    validation.commit(value);
                }
            },
            onPointerMove({ pointerType }) {
                keyboardActiveRef.current = false;
                store.set('touchModality', pointerType === 'touch');
            },
            onPointerDown({ pointerType }) {
                store.set('touchModality', pointerType === 'touch');
            },
            onKeyDown() {
                keyboardActiveRef.current = true;
            },
            onMouseDown(event) {
                if (open) {
                    return;
                }

                const doc = ownerDocument(event.currentTarget);

                function handleMouseUp(mouseEvent: MouseEvent) {
                    if (!triggerRef.current) {
                        return;
                    }

                    const mouseUpTarget = mouseEvent.target as Element | null;

                    // Early return if clicked on trigger element or its children
                    if (
                        contains(triggerRef.current, mouseUpTarget)
                        || contains(positionerRef.current, mouseUpTarget)
                        || mouseUpTarget === triggerRef.current
                    ) {
                        return;
                    }

                    const bounds = getPseudoElementBounds(triggerRef.current);

                    if (
                        mouseEvent.clientX >= bounds.left - BOUNDARY_OFFSET
                        && mouseEvent.clientX <= bounds.right + BOUNDARY_OFFSET
                        && mouseEvent.clientY >= bounds.top - BOUNDARY_OFFSET
                        && mouseEvent.clientY <= bounds.bottom + BOUNDARY_OFFSET
                    ) {
                        return;
                    }

                    setOpen(false, createChangeEventDetails(REASONS.cancelOpen, mouseEvent));
                }

                // Firefox can fire this upon mousedown
                timeoutMouseDown.start(0, () => {
                    doc.addEventListener('mouseup', handleMouseUp, { once: true });
                });
            }
        },
        validation.getValidationProps,
        elementProps,
        getButtonProps
    );

    // ensure nested useButton does not overwrite the combobox role:
    // <Toolbar.Button render={<Select.Trigger />} />
    props.role = 'combobox';

    const state: SelectTrigger.State = React.useMemo(
        () => ({
            ...fieldState,
            open,
            disabled,
            value,
            readOnly,
            placeholder: !serializedValue
        }),
        [
            fieldState,
            open,
            disabled,
            value,
            readOnly,
            serializedValue
        ]
    );

    return useRenderElement('button', componentProps, {
        ref: [ref, triggerRef],
        state,
        customStyleHookMapping,
        props
    });
}

export type SelectTriggerState = {
    /** Whether the select popup is currently open. */
    open: boolean;
    /** Whether the select popup is readonly. */
    readOnly: boolean;
    /** The value of the currently selected item. */
    value: any;
} & FieldRoot.State;

export type SelectTriggerProps = {
    children?: React.ReactNode;
    /** Whether the component should ignore user interaction. */
    disabled?: boolean;
} & NativeButtonProps & HeadlessUIComponentProps<'button', SelectTrigger.State>;

export namespace SelectTrigger {
    export type State = SelectTriggerState;
    export type Props = SelectTriggerProps;
}
