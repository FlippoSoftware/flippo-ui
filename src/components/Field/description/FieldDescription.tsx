'use client';

import { useIsoLayoutEffect } from '@flippo-ui/hooks';

import { useHeadlessUiId, useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

import { useFieldRootContext } from '../root/FieldRootContext';
import { fieldValidityMapping } from '../utils/constants';

import type { FieldRoot } from '../root/FieldRoot';

/**
 * A paragraph with additional information about the field.
 * Renders a `<p>` element.
 *
 * Documentation: [Base UI Field](https://base-ui.com/react/components/field)
 */
export function FieldDescription(componentProps: FieldDescription.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;

    const { state } = useFieldRootContext(false);

    const id = useHeadlessUiId(idProp);

    const { setMessageIds } = useFieldRootContext();

    useIsoLayoutEffect(() => {
        if (!id) {
            return undefined;
        }

        setMessageIds((v) => v.concat(id));

        return () => {
            setMessageIds((v) => v.filter((item) => item !== id));
        };
    }, [id, setMessageIds]);

    const element = useRenderElement('p', componentProps, {
        ref,
        state,
        props: [{ id }, elementProps],
        customStyleHookMapping: fieldValidityMapping
    });

    return element;
}

export namespace FieldDescription {
    export type State = FieldRoot.State;

    export type Props = HeadlessUIComponentProps<'p', State>;
}
