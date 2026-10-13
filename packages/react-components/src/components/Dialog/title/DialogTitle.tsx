import React from 'react';

import { registerDialogTitle } from '@flippo-software/core-components/dialog';
import { useIsoLayoutEffect } from '@flippo-software/react-hooks';

import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';
import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useDialogRootContext } from '../root/DialogRootContext';

/**
 * A heading that labels the dialog.
 * Renders an `<h2>` element.
 *
 * Documentation: [Base UI Dialog](https://base-ui.com/react/components/dialog)
 */
export function DialogTitle(componentProps: DialogTitleProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;
    const { store } = useDialogRootContext();

    const id = useHeadlessUiId(idProp);

    useIsoLayoutEffect(() => (id === undefined ? undefined : registerDialogTitle(store, id)), [store, id]);

    return useRenderElement('h2', componentProps, {
        ref,
        props: [{ id }, elementProps]
    });
}

export type DialogTitleProps = {} & HeadlessUIComponentProps<'h2', DialogTitle.State>;

export type DialogTitleState = {};

export namespace DialogTitle {
    export type Props = DialogTitleProps;
    export type State = DialogTitleState;
}
