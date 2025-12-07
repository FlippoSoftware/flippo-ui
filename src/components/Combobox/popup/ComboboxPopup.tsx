import React from 'react';

import { useOpenChangeComplete } from '@flippo-ui/hooks/use-open-change-complete';
import { useStore } from '@flippo-ui/hooks/use-store';

import type { Interaction } from '@flippo-ui/hooks/use-enhanced-click-handler';
import type { TransitionStatus } from '@flippo-ui/hooks/use-transition-status';

import { getDisabledMountTransitionStyles } from '~@lib/getDisabledMountTransitionStyles';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { popupStateMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';
import { FloatingFocusManager } from '~@packages/floating-ui-react';
import { contains, getTarget } from '~@packages/floating-ui-react/utils';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { Align, Side } from '~@lib/hooks/useAnchorPositioning';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useComboboxPositionerContext } from '../positioner/ComboboxPositionerContext';
import {
    useComboboxDerivedItemsContext,
    useComboboxFloatingContext,
    useComboboxRootContext
} from '../root/ComboboxRootContext';
import { selectors } from '../store';

const stateAttributesMapping: StateAttributesMapping<ComboboxPopup.State> = {
    ...popupStateMapping,
    ...transitionStatusMapping
};

/**
 * A container for the list.
 * Renders a `<div>` element.
 */
export function ComboboxPopup(componentProps: ComboboxPopup.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        initialFocus,
        finalFocus,
        ref,
        ...elementProps
    } = componentProps;

    const store = useComboboxRootContext();
    const positioning = useComboboxPositionerContext();
    const floatingRootContext = useComboboxFloatingContext();
    const { filteredItems } = useComboboxDerivedItemsContext();

    const mounted = useStore(store, selectors.mounted);
    const open = useStore(store, selectors.open);
    const openMethod = useStore(store, selectors.openMethod);
    const transitionStatus = useStore(store, selectors.transitionStatus);
    const inputInsidePopup = useStore(store, selectors.inputInsidePopup);
    const inputElement = useStore(store, selectors.inputElement);

    const empty = filteredItems.length === 0;

    useOpenChangeComplete({
        open,
        ref: store.state.popupRef,
        onComplete() {
            if (open) {
                store.state.onOpenChangeComplete(true);
            }
        }
    });

    const state: ComboboxPopup.State = React.useMemo(
        () => ({
            open,
            side: positioning.side,
            align: positioning.align,
            anchorHidden: positioning.anchorHidden,
            transitionStatus,
            empty
        }),
        [
            open,
            positioning.side,
            positioning.align,
            positioning.anchorHidden,
            transitionStatus,
            empty
        ]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, store.state.popupRef],
        props: [{
            role: inputInsidePopup ? 'dialog' : 'presentation',
            tabIndex: -1,
            onFocus(event) {
                const target = getTarget(event.nativeEvent) as Element | null;
                if (
                    openMethod !== 'touch'
                    && (contains(store.state.listElement, target) || target === event.currentTarget)
                ) {
                    store.state.inputRef.current?.focus();
                }
            }
        }, getDisabledMountTransitionStyles(transitionStatus), elementProps],
        customStyleHookMapping: stateAttributesMapping
    });

    // Default initial focus logic:
    // If opened by touch, focus the popup element to prevent the virtual keyboard from opening
    // (this is required for Android specifically as iOS handles this automatically).
    const computedDefaultInitialFocus = inputInsidePopup
        ? (interactionType: Interaction) =>
            interactionType === 'touch' ? store.state.popupRef.current : inputElement
        : false;

    const resolvedInitialFocus
    = initialFocus === undefined ? computedDefaultInitialFocus : initialFocus;

    let resolvedFinalFocus: ComboboxPopup.Props['finalFocus'] | boolean | undefined;
    if (finalFocus != null) {
        resolvedFinalFocus = finalFocus;
    }
    else {
        resolvedFinalFocus = inputInsidePopup ? undefined : false;
    }

    return (
        <FloatingFocusManager
          context={floatingRootContext}
          disabled={!mounted}
          modal={!inputInsidePopup}
          openInteractionType={openMethod}
          initialFocus={resolvedInitialFocus}
          returnFocus={resolvedFinalFocus}
        >
            {element}
        </FloatingFocusManager>
    );
}

export type ComboboxPopupState = {
    open: boolean;
    side: Side;
    align: Align;
    anchorHidden: boolean;
    transitionStatus: TransitionStatus;
    empty: boolean;
};

export type ComboboxPopupProps = {
    /**
     * Determines the element to focus when the popup is opened.
     *
     * - `false`: Do not move focus.
     * - `true`: Move focus based on the default behavior (first tabbable element or popup).
     * - `RefObject`: Move focus to the ref element.
     * - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`).
     *   Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
     */
    initialFocus?:
      | boolean
      | React.RefObject<HTMLElement | null>
      | ((openType: Interaction) => void | boolean | HTMLElement | null);
    /**
     * Determines the element to focus when the popup is closed.
     *
     * - `false`: Do not move focus.
     * - `true`: Move focus based on the default behavior (trigger or previously focused element).
     * - `RefObject`: Move focus to the ref element.
     * - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`).
     *   Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
     */
    finalFocus?:
      | boolean
      | React.RefObject<HTMLElement | null>
      | ((closeType: Interaction) => void | boolean | HTMLElement | null);
} & HeadlessUIComponentProps<'div', ComboboxPopup.State>;

export namespace ComboboxPopup {
    export type State = ComboboxPopupState;
    export type Props = ComboboxPopupProps;
}
