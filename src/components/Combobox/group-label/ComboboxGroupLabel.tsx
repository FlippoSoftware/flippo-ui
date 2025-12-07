import { useIsoLayoutEffect } from '@flippo-ui/hooks/use-iso-layout-effect';

import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';
import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useComboboxGroupContext } from '../group/ComboboxGroupContext';

/**
 * An accessible label that is automatically associated with its parent group.
 * Renders a `<div>` element.
 */
export function ComboboxGroupLabel(componentProps: ComboboxGroupLabel.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;

    const { setLabelId } = useComboboxGroupContext();

    const id = useHeadlessUiId(idProp);

    useIsoLayoutEffect(() => {
        setLabelId(id);
        return () => {
            setLabelId(undefined);
        };
    }, [id, setLabelId]);

    const element = useRenderElement('div', componentProps, {
        ref,
        props: [{ id }, elementProps]
    });

    return element;
}

export type ComboboxGroupLabelState = {};

export type ComboboxGroupLabelProps = {} & HeadlessUIComponentProps<'div', ComboboxGroupLabel.State>;

export namespace ComboboxGroupLabel {
    export type State = ComboboxGroupLabelState;
    export type Props = ComboboxGroupLabelProps;
}
