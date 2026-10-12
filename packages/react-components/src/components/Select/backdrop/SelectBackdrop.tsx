import React from 'react';

import { SelectBackdrop as SelectBackdropCore } from '@flippo-software/core-components/select';

import type { TransitionStatus } from '@flippo-ui/hooks';

import { toReactProps, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useSelectRoot } from '../root/SelectRootContext';

const customStyleHookMapping: StateAttributesMapping<SelectBackdrop.State> = {
    ...popupStateMapping,
    ...transitionStatusMapping
};

/**
 * An overlay displayed beneath the menu popup.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectBackdrop(componentProps: SelectBackdrop.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const root = useSelectRoot();
    const track = useTracker();
    const { open, transitionStatus } = track(() => SelectBackdropCore.getState(root));
    const state: SelectBackdrop.State = React.useMemo(() => ({ open, transitionStatus }), [open, transitionStatus]);

    return useRenderElement('div', componentProps, {
        ref,
        state,
        customStyleHookMapping,
        props: [elementProps, (props) => track(() => toReactProps(SelectBackdropCore.getProps(root, props)))]
    });
}

export type SelectBackdropState = {
    open: boolean;
    transitionStatus: TransitionStatus;
};

export type SelectBackdropProps = {} & HeadlessUIComponentProps<'div', SelectBackdrop.State>;

export namespace SelectBackdrop {
    export type State = SelectBackdropState;
    export type Props = SelectBackdropProps;
}
