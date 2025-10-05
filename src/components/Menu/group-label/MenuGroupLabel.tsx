import { useIsoLayoutEffect } from '@flippo-ui/hooks';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useMenuGroupRootContext } from '../group/MenuGroupContext';

/**
 * An accessible label that is automatically associated with its parent group.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuGroupLabel(componentProps: MenuGroupLabel.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;

    const id = useHeadlessUiId(idProp);

    const { setLabelId } = useMenuGroupRootContext();

    useIsoLayoutEffect(() => {
        setLabelId(id);
        return () => {
            setLabelId(undefined);
        };
    }, [setLabelId, id]);

    return useRenderElement('div', componentProps, {
        ref,
        props: {
            id,
            role: 'presentation',
            ...elementProps
        }
    });
}

export namespace MenuGroupLabel {
    export type State = object;

    export type Props = HeadlessUIComponentProps<'div', State>;
}
