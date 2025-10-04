'use client';

import { useIsoLayoutEffect } from '@flippo-ui/hooks';

import { useHeadlessUiId, useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

import { useDialogRootContext } from '../root/DialogRootContext';

/**
 * A heading that labels the dialog.
 * Renders an `<h2>` element.
 *
 * Documentation: [Base UI Dialog](https://base-ui.com/react/components/dialog)
 */
export function DialogTitle(componentProps: DialogTitle.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;
    const { setTitleElementId } = useDialogRootContext();

    const id = useHeadlessUiId(idProp);

    useIsoLayoutEffect(() => {
        setTitleElementId(id);
        return () => {
            setTitleElementId(undefined);
        };
    }, [id, setTitleElementId]);

    const element = useRenderElement('h2', componentProps, {
        ref,
        props: [{ id }, elementProps]
    });

    return element;
}

export namespace DialogTitle {
    export type State = object;

    export type Props = HeadlessUIComponentProps<'h2', State>;
}
