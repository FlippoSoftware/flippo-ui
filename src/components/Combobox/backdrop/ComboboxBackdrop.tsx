import React from 'react';

import { useStore } from '@flippo-ui/hooks/use-store';

import type { TransitionStatus } from '@flippo-ui/hooks/use-transition-status';

import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { popupStateMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useComboboxRootContext } from '../root/ComboboxRootContext';
import { selectors } from '../store';

const stateAttributesMapping: StateAttributesMapping<ComboboxBackdrop.State> = {
    ...popupStateMapping,
    ...transitionStatusMapping
};

/**
 * An overlay displayed beneath the popup.
 * Renders a `<div>` element.
 */
export function ComboboxBackdrop(componentProps: ComboboxBackdrop.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const store = useComboboxRootContext();

    const open = useStore(store, selectors.open);
    const mounted = useStore(store, selectors.mounted);
    const transitionStatus = useStore(store, selectors.transitionStatus);

    const state: ComboboxBackdrop.State = React.useMemo(
        () => ({
            open,
            transitionStatus
        }),
        [open, transitionStatus]
    );

    return useRenderElement('div', componentProps, {
        state,
        ref,
        customStyleHookMapping: stateAttributesMapping,
        props: [{
            role: 'presentation',
            hidden: !mounted,
            style: {
                userSelect: 'none',
                WebkitUserSelect: 'none'
            }
        }, elementProps]
    });
}

export type ComboboxBackdropProps = {} & HeadlessUIComponentProps<'div', ComboboxBackdrop.State>;

export type ComboboxBackdropState = {
    /**
     * Whether the popup is currently open.
     */
    open: boolean;
    transitionStatus: TransitionStatus;
};

export namespace ComboboxBackdrop {
    export type Props = ComboboxBackdropProps;
    export type State = ComboboxBackdropState;
}
