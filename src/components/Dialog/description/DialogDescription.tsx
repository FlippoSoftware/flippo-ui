import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';
import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

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
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        id: idProp,
        ...elementProps
    } = componentProps;
    const { store } = useDialogRootContext();

    const id = useHeadlessUiId(idProp);

    store.useSyncedValueWithCleanup('descriptionElementId', id);

    return useRenderElement('p', componentProps, {
        ref,
        props: [{ id }, elementProps]
    });
}

export namespace DialogDescription {
    export type Props = {} & HeadlessUIComponentProps<'p', State>;

    export type State = {};
}
