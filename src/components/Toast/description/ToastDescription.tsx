'use client';
import React from 'react';

import { useId, useIsoLayoutEffect } from '@flippo_ui/hooks';

import { useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

import { useToastRootContext } from '../root/ToastRootContext';

/**
 * A description that describes the toast.
 * Can be used as the default message for the toast when no title is provided.
 * Renders a `<p>` element.
 *
 * Documentation: [Base UI Toast](https://base-ui.com/react/components/toast)
 */
export function ToastDescription(componentProps: ToastDescription.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        id: idProp,
        children: childrenProp,
        ref,
        ...elementProps
    } = componentProps;

    const { toast, setDescriptionId } = useToastRootContext();

    const children = childrenProp ?? toast.description;

    const shouldRender = Boolean(children);

    const id = useId(idProp);

    useIsoLayoutEffect(() => {
        if (!shouldRender) {
            return undefined;
        }

        setDescriptionId(id);

        return () => {
            setDescriptionId(undefined);
        };
    }, [shouldRender, id, setDescriptionId]);

    const state: ToastDescription.State = React.useMemo(
        () => ({
            type: toast.type
        }),
        [toast.type]
    );

    const element = useRenderElement('p', componentProps, {
        ref,
        state,
        props: {
            ...elementProps,
            id,
            children
        }
    });

    if (!shouldRender) {
        return null;
    }

    return element;
}

export namespace ToastDescription {
    export type State = {
        /**
         * The type of the toast.
         */
        type: string | undefined;
    };

    export type Props = HeadlessUIComponentProps<'p', State>;
}
