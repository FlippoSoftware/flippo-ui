'use client';
import React from 'react';

import { useId, useIsoLayoutEffect } from '@flippo_ui/hooks';

import { useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

import { useToastRootContext } from '../root/ToastRootContext';

/**
 * A title that labels the toast.
 * Renders an `<h2>` element.
 *
 * Documentation: [Base UI Toast](https://base-ui.com/react/components/toast)
 */
export function ToastTitle(componentProps: ToastTitle.Props) {
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

    const { toast, setTitleId } = useToastRootContext();

    const children = childrenProp ?? toast.title;

    const shouldRender = Boolean(children);

    const id = useId(idProp);

    useIsoLayoutEffect(() => {
        if (!shouldRender) {
            return undefined;
        }

        setTitleId(id);

        return () => {
            setTitleId(undefined);
        };
    }, [shouldRender, id, setTitleId]);

    const state: ToastTitle.State = React.useMemo(
        () => ({
            type: toast.type
        }),
        [toast.type]
    );

    const element = useRenderElement('h2', componentProps, {
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

export namespace ToastTitle {
    export type State = {
        /**
         * The type of the toast.
         */
        type: string | undefined;
    };

    export type Props = HeadlessUIComponentProps<'h2', State>;
}
