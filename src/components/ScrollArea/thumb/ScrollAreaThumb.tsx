import React from 'react';

import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useScrollAreaRootContext } from '../root/ScrollAreaRootContext';
import { useScrollAreaScrollbarContext } from '../scrollbar/ScrollAreaScrollbarContext';
import { ScrollAreaScrollbarCssVars } from '../scrollbar/ScrollAreaScrollbarCssVars';

/**
 * The draggable part of the the scrollbar that indicates the current scroll position.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Scroll Area](https://base-ui.com/react/components/scroll-area)
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

    const {
        thumbYRef,
        thumbXRef,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        setScrollingX,
        setScrollingY
    } = useScrollAreaRootContext();

    const { orientation } = useScrollAreaScrollbarContext();

    const state: ScrollAreaThumb.State = React.useMemo(() => ({ orientation }), [orientation]);

    const element = useRenderElement('div', componentProps, {
        ref: [ref, orientation === 'vertical' ? thumbYRef : thumbXRef],
        state,
        props: [{
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp(event) {
                if (orientation === 'vertical') {
                    setScrollingY(false);
                }
                if (orientation === 'horizontal') {
                    setScrollingX(false);
                }
                handlePointerUp(event);
            },
            style: {
                ...(orientation === 'vertical' && {
                    height: `var(${ScrollAreaScrollbarCssVars.scrollAreaThumbHeight})`
                }),
                ...(orientation === 'horizontal' && {
                    width: `var(${ScrollAreaScrollbarCssVars.scrollAreaThumbWidth})`
                })
            }
        }, elementProps]
    });

    return element;
}

export namespace ScrollAreaThumb {
    export type State = {
        orientation?: 'horizontal' | 'vertical';
    };
    export type Props = HeadlessUIComponentProps<'div', ScrollAreaThumb.State>;
}
