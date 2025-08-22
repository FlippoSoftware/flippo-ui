'use client';

import { useIsoLayoutEffect } from '@flippo_ui/hooks';

import { useHeadlessUiId, useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

import { useSelectGroupContext } from '../group/SelectGroupContext';

/**
 * An accessible label that is automatically associated with its parent group.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectGroupLabel(componentProps: SelectGroupLabel.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;

    const { setLabelId } = useSelectGroupContext();

    const id = useHeadlessUiId(idProp);

    useIsoLayoutEffect(() => {
        setLabelId(id);
    }, [id, setLabelId]);

    const element = useRenderElement('span', componentProps, {
        ref,
        props: [{ id }, elementProps]
    });

    return element;
}

export namespace SelectGroupLabel {
    export type State = object;

    export type Props = HeadlessUIComponentProps<'div', State>;
}
