import React from 'react';

import type { TransitionStatus } from '@flippo-ui/hooks/use-transition-status';

import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { popupStateMapping as baseMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useDialogRootContext } from '../root/DialogRootContext';

const stateAttributesMapping: StateAttributesMapping<DialogBackdrop.State> = {
    ...baseMapping,
    ...transitionStatusMapping
};

/**
 * An overlay displayed beneath the popup.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Dialog](https://base-ui.com/react/components/dialog)
 */
export function DialogBackdrop(componentProps: DialogBackdrop.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        forceRender = false,
        ref,
        ...elementProps
    } = componentProps;
    const { store } = useDialogRootContext();

    const open = store.useState('open');
    const nested = store.useState('nested');
    const mounted = store.useState('mounted');
    const transitionStatus = store.useState('transitionStatus');

    const state: DialogBackdrop.State = React.useMemo(
        () => ({
            open,
            transitionStatus
        }),
        [open, transitionStatus]
    );

    return useRenderElement('div', componentProps, {
        state,
        ref: [store.context.backdropRef, ref],
        customStyleHookMapping: stateAttributesMapping,
        props: [{
            role: 'presentation',
            hidden: !mounted,
            style: {
                userSelect: 'none',
                WebkitUserSelect: 'none'
            }
        }, elementProps],
        enabled: forceRender || !nested
    });
}

export namespace DialogBackdrop {

    export type Props = {
    /**
     * Whether the backdrop is forced to render even when nested.
     * @default false
     */
        forceRender?: boolean;
    } & HeadlessUIComponentProps<'div', DialogBackdrop.State>;

    export type State = {
    /**
     * Whether the dialog is currently open.
     */
        open: boolean;
        transitionStatus: TransitionStatus;
    };

}
