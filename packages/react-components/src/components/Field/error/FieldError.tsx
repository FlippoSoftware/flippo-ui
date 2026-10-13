import React from 'react';

import { useIsoLayoutEffect } from '@flippo-software/react-hooks';

import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useLabelableContext } from '../../LabelableProvider';
import { useFieldRootContext } from '../root/FieldRootContext';
import { fieldValidityMapping } from '../utils/constants';

import type { FieldRoot } from '../root/FieldRoot';

/**
 * An error message displayed if the field control fails validation.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Field](https://base-ui.com/react/components/field)
 */
export function FieldError(componentProps: FieldError.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        id: idProp,
        match,
        ref,
        ...elementProps
    } = componentProps;

    const id = useHeadlessUiId(idProp);

    const { state, field } = useFieldRootContext(false);
    const { setMessageIds } = useLabelableContext();

    const rendered = field?.isErrorRendered(match) ?? false;
    const messages = field?.getErrorMessages() ?? '';

    useIsoLayoutEffect(() => {
        if (!rendered || !id) {
            return;
        }

        setMessageIds((v) => v.concat(id));

        return () => {
            setMessageIds((v) => v.filter((item) => item !== id));
        };
    }, [rendered, id, setMessageIds]);

    const element = useRenderElement('div', componentProps, {
        ref,
        state,
        props: [
            {
                id,
                children: Array.isArray(messages)
                    ? React.createElement(
                          'ul',
                          {},
                          messages.map((message) => React.createElement('li', { key: message }, message))
                      )
                    : messages
            },
            elementProps
        ],
        customStyleHookMapping: fieldValidityMapping
    });

    if (!rendered) {
        return null;
    }

    return element;
}

export namespace FieldError {
    export type State = FieldRoot.State;

    export type Props = {
        /**
         * Determines whether to show the error message according to the field’s
         * [ValidityState](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState).
         * Specifying `true` will always show the error message, and lets external libraries
         * control the visibility.
         */
        match?: boolean | keyof ValidityState;
    } & HeadlessUIComponentProps<'div', State>;
}
