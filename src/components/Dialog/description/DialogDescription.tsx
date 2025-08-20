'use client';

import { useIsoLayoutEffect } from '@flippo_ui/hooks';

import { useHeadlessUiId, useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

import { useDialogRootContext } from '../root/DialogRootContext';

/**
 * A paragraph with additional information about the dialog.
 * Renders a `<p>` element.
 *
 * Documentation: [Base UI Dialog](https://base-ui.com/react/components/dialog)
 */
export function DialogDescription(componentProps: DialogDescription.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;
    const { setDescriptionElementId } = useDialogRootContext();

    const id = useHeadlessUiId(idProp);

    useIsoLayoutEffect(() => {
        setDescriptionElementId(id);
        return () => {
            setDescriptionElementId(undefined);
        };
    }, [id, setDescriptionElementId]);

    const element = useRenderElement('p', componentProps, {
        ref,
        props: [{ id }, elementProps]
    });

    return element;
}

export namespace DialogDescription {
    export type State = object;

    export type Props = HeadlessUIComponentProps<'p', State>;
}
