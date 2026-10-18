import React from 'react';

import { DialogViewportDataAttributes } from '@flippo-software/core-components/dialog';

import type { TransitionStatus } from '@flippo-software/react-hooks/use-transition-status';

import { useStoreSelector } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { popupStateMapping as baseMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useDialogPortalContext } from '../portal/DialogPortalContext';
import { useDialogRootContext } from '../root/DialogRootContext';

const stateAttributesMapping: StateAttributesMapping<DialogViewport.State> = {
    ...baseMapping,
    ...transitionStatusMapping,
    nested(value) {
        return value ? { [DialogViewportDataAttributes.nested]: '' } : null;
    },
    nestedDialogOpen(value) {
        return value ? { [DialogViewportDataAttributes.nestedDialogOpen]: '' } : null;
    }
};

/**
 * A positioning container for the dialog popup that can be made scrollable.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Dialog](https://base-ui.com/react/components/dialog)
 */
export function DialogViewport(componentProps: DialogViewportProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        children,
        ref,
        ...elementProps
    } = componentProps;

    const keepMounted = useDialogPortalContext();
    const { store } = useDialogRootContext();

    const open = useStoreSelector(store, 'open');
    const nested = useStoreSelector(store, 'nested');
    const transitionStatus = useStoreSelector(store, 'transitionStatus');
    const nestedOpenDialogCount = useStoreSelector(store, 'nestedOpenDialogCount');
    const mounted = useStoreSelector(store, 'mounted');

    const nestedDialogOpen = nestedOpenDialogCount > 0;

    const state: DialogViewport.State = React.useMemo(
        () => ({
            open,
            nested,
            transitionStatus,
            nestedDialogOpen
        }),
        [open, nested, transitionStatus, nestedDialogOpen]
    );

    const shouldRender = keepMounted || mounted;
    const setViewportElement = React.useCallback((element: HTMLElement | null) => store.set('viewportElement', element), [store]);

    return useRenderElement('div', componentProps, {
        enabled: shouldRender,
        state,
        ref: [ref, setViewportElement],
        customStyleHookMapping: stateAttributesMapping,
        props: [
            {
                role: 'presentation',
                hidden: !mounted,
                children
            },
            elementProps
        ]
    });
}

export type DialogViewportState = {
    /**
     * Whether the dialog is currently open.
     */
    open: boolean;
    transitionStatus: TransitionStatus;
    /**
     * Whether the dialog is nested within another dialog.
     */
    nested: boolean;
    /**
     * Whether the dialog has nested dialogs open.
     */
    nestedDialogOpen: boolean;
};

export type DialogViewportProps = {} & HeadlessUIComponentProps<'div', DialogViewportState>;

export namespace DialogViewport {
    export type State = DialogViewportState;
    export type Props = DialogViewportProps;
}
