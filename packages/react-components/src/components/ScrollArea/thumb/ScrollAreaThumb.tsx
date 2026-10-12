import React from 'react';

import { toReactProps } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useScrollAreaRootContext } from '../root/ScrollAreaRootContext';
import { useScrollAreaScrollbarContext } from '../scrollbar/ScrollAreaScrollbarContext';

/**
 * The draggable part of the scrollbar that indicates the current scroll position.
 * Renders a `<div>` element.
 */
export function ScrollAreaThumb(componentProps: ScrollAreaThumb.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { scrollArea } = useScrollAreaRootContext();
    const { orientation } = useScrollAreaScrollbarContext();

    const state: ScrollAreaThumb.State = { orientation };

    const setElement = React.useCallback(
        (element: HTMLDivElement | null) => scrollArea.setThumb(orientation, element),
        [scrollArea, orientation]
    );

    return useRenderElement('div', componentProps, {
        ref: [ref, setElement],
        state,
        props: [toReactProps(scrollArea.getThumbProps(orientation)), elementProps]
    });
}

export namespace ScrollAreaThumb {
    export type State = {
        orientation?: 'horizontal' | 'vertical';
    };
    export type Props = HeadlessUIComponentProps<'div', ScrollAreaThumb.State>;
}
