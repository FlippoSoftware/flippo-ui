import { useIsoLayoutEffect } from '@flippo-ui/hooks';

import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useLabelableContext } from '../../LabelableProvider';
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

    const id = useHeadlessUiId(idProp);

    const fieldRootContext = useFieldRootContext(false);
    const { setMessageIds } = useLabelableContext();

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
        state: fieldRootContext.state,
        props: [{ id }, elementProps],
        customStyleHookMapping: fieldValidityMapping
    });

    return element;
}

export namespace FieldDescription {
    export type State = FieldRoot.State;

    export type Props = HeadlessUIComponentProps<'p', State>;
}
