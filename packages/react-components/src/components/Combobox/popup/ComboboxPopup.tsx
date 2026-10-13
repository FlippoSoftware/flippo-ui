import React from 'react';

import { ComboboxPopupMachine } from '@flippo-software/core-components/combobox';

import type { ComboboxPopupOptions } from '@flippo-software/core-components/combobox';
import type { Interaction, TransitionStatus } from '@flippo-software/react-hooks';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { FocusGuards, useFloatingPortalController } from '~@lib/floating';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { popupStateMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { Align, Side } from '~@lib/hooks/useAnchorPositioning';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useComboboxPositionerContext } from '../positioner/ComboboxPositionerContext';
import { useComboboxRootMachine } from '../root/ComboboxRootContext';

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

    const root = useComboboxRootMachine();
    const positioner = useComboboxPositionerContext(true)?.positioner ?? null;
    const portal = useFloatingPortalController();

    const popup = useMachine((options) => new ComboboxPopupMachine(root, positioner, options, portal), {
        initialFocus,
        finalFocus
    } as ComboboxPopupOptions);
    const track = useTracker();
    const state: ComboboxPopup.State = useMachineState(
        popup,
        positioner ? [root.store, root.derived, positioner.positioner.store] : [root.store, root.derived]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, popup.setElement],
        props: [elementProps, (props) => track(() => toReactProps(popup.getPopupProps(props)))],
        customStyleHookMapping: stateAttributesMapping
    });

    return (
        <FocusGuards store={root.store} getFocusManager={() => popup.focusManager}>
            {element}
        </FocusGuards>
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
    initialFocus?: boolean | React.RefObject<HTMLElement | null> | ((openType: Interaction) => void | boolean | HTMLElement | null);
    /**
     * Determines the element to focus when the popup is closed.
     *
     * - `false`: Do not move focus.
     * - `true`: Move focus based on the default behavior (trigger or previously focused element).
     * - `RefObject`: Move focus to the ref element.
     * - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`).
     *   Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
     */
    finalFocus?: boolean | React.RefObject<HTMLElement | null> | ((closeType: Interaction) => void | boolean | HTMLElement | null);
} & HeadlessUIComponentProps<'div', ComboboxPopup.State>;

export namespace ComboboxPopup {
    export type State = ComboboxPopupState;
    export type Props = ComboboxPopupProps;
}
