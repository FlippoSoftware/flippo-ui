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
    const { store } = useDialogRootContext();

    const id = useHeadlessUiId(idProp);

    store.useSyncedValueWithCleanup('titleElementId', id);

    return useRenderElement('h2', componentProps, {
        ref,
        props: [{ id }, elementProps]
    });
}

export namespace DialogTitle {
    export type Props = {} & HeadlessUIComponentProps<'h2', DialogTitle.State>;

    export type State = {};
}
