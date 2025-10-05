

import { useIsoLayoutEffect } from '@flippo-ui/hooks';

import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';
import { getTarget } from '~@packages/floating-ui-react/utils';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useFieldRootContext } from '../root/FieldRootContext';
import { fieldValidityMapping } from '../utils/constants';

import type { FieldRoot } from '../root/FieldRoot';

/**
 * An accessible label that is automatically associated with the field control.
 * Renders a `<label>` element.
 *
 * Documentation: [Base UI Field](https://base-ui.com/react/components/field)
 */
export function FieldLabel(componentProps: FieldLabel.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;

    const {
        labelId,
        setLabelId,
        state,
        controlId
    } = useFieldRootContext(false);

    const id = useHeadlessUiId(idProp);
    const htmlFor = controlId ?? undefined;

    useIsoLayoutEffect(() => {
        if (controlId != null || idProp) {
            setLabelId(id);
        }
        return () => {
            setLabelId(undefined);
        };
    }, [
        controlId,
        id,
        idProp,
        setLabelId
    ]);

    const element = useRenderElement('label', componentProps, {
        ref,
        state,
        props: [{
            id: labelId,
            htmlFor,
            onMouseDown(event) {
                const target = getTarget(event.nativeEvent) as HTMLElement | null;
                if (target?.closest('button,input,select,textarea')) {
                    return;
                }

                // Prevent text selection when double clicking label.
                if (!event.defaultPrevented && event.detail > 1) {
                    event.preventDefault();
                }
            }
        }, elementProps],
        customStyleHookMapping: fieldValidityMapping
    });

    return element;
}

export namespace FieldLabel {
    export type State = FieldRoot.State;

    export type Props = HeadlessUIComponentProps<'label', State>;
}
