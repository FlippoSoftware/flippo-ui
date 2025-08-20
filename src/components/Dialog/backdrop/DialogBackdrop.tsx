'use client';

import React from 'react';

import type { TransitionStatus } from '@flippo_ui/hooks';

import { useRenderElement } from '@lib/hooks';
import { popupStateMapping } from '@lib/popupStateMapping';
import { transitionStatusMapping } from '@lib/styleHookMapping';

import type { CustomStyleHookMapping } from '@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '@lib/types';

import { useDialogRootContext } from '../root/DialogRootContext';

const customStyleHookMapping: CustomStyleHookMapping<DialogBackdrop.State> = {
    ...popupStateMapping,
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
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        forceRender = false,
        ref,
        ...elementProps
    } = componentProps;

    const {
        open,
        nested,
        mounted,
        transitionStatus,
        backdropRef
    } = useDialogRootContext();

    const state: DialogBackdrop.State = React.useMemo(
        () => ({
            open,
            transitionStatus
        }),
        [open, transitionStatus]
    );

    return useRenderElement('div', componentProps, {
        state,
        ref: [backdropRef, ref],
        customStyleHookMapping,
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
    export type State = {
        /**
         * Whether the dialog is currently open.
         */
        open: boolean;
        transitionStatus: TransitionStatus;
    };

    export type Props = {
        /**
         * Whether the backdrop is forced to render even when nested.
         * @default false
         */
        forceRender?: boolean;
    } & HeadlessUIComponentProps<'div', State>;
}
