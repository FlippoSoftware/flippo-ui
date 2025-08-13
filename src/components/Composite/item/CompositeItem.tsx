'use client';

import type React from 'react';

import { EMPTY_ARRAY, EMPTY_OBJECT } from '@lib/constants';
import { useRenderElement } from '@lib/hooks';

import type { CustomStyleHookMapping } from '@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '@lib/types';

import { useCompositeItem } from './useCompositeItem';

export function CompositeItem<Metadata, State extends Record<string, any>>(
    componentProps: CompositeItem.Props<Metadata, State>
) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        state = EMPTY_OBJECT as State,
        props = EMPTY_ARRAY,
        refs = EMPTY_ARRAY,
        metadata,
        customStyleHookMapping,
        tag = 'div',
        ...elementProps
    } = componentProps;

    const { compositeProps, compositeRef } = useCompositeItem({ metadata });

    return useRenderElement(tag, componentProps, {
        state,
        ref: [...refs, compositeRef],
        props: [compositeProps, ...props, elementProps],
        customStyleHookMapping
    });
}

export namespace CompositeItem {
    export type Props<Metadata, State extends Record<string, any>> = {
        children?: React.ReactNode;
        metadata?: Metadata;
        refs?: (React.Ref<HTMLElement | null> | undefined)[];
        props?: Array<Record<string, any> | (() => Record<string, any>)>;
        state?: State;
        customStyleHookMapping?: CustomStyleHookMapping<State>;
        tag?: keyof React.JSX.IntrinsicElements;
    } & Pick<HeadlessUIComponentProps<any, State>, 'render' | 'className'>;
}
