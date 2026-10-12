import React from 'react';

import { toReactProps } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useScrollAreaRootContext } from '../root/ScrollAreaRootContext';
import { scrollAreaStateAttributesMapping } from '../root/stateAttributes';

import type { ScrollAreaRoot } from '../root/ScrollAreaRoot';

import { ScrollAreaScrollbarContext } from './ScrollAreaScrollbarContext';

/**
 * A vertical or horizontal scrollbar for the scroll area.
 * Renders a `<div>` element.
 */
export function ScrollAreaScrollbar(componentProps: ScrollAreaScrollbar.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        orientation = 'vertical',
        keepMounted = false,
        ...elementProps
    } = componentProps;

    const { scrollArea } = useScrollAreaRootContext();

    const state: ScrollAreaScrollbar.State = scrollArea.getScrollbarState(orientation);

    const setElement = React.useCallback(
        (element: HTMLDivElement | null) => scrollArea.setScrollbar(orientation, element),
        [scrollArea, orientation]
    );

    const element = useRenderElement('div', componentProps, {
        ref: [ref, setElement],
        state,
        props: [toReactProps(scrollArea.getScrollbarProps(orientation)), elementProps],
        customStyleHookMapping: scrollAreaStateAttributesMapping
    });

    const contextValue = React.useMemo(() => ({ orientation }), [orientation]);

    if (!scrollArea.shouldRenderScrollbar(orientation, keepMounted)) {
        return null;
    }

    return <ScrollAreaScrollbarContext.Provider value={contextValue}>{element}</ScrollAreaScrollbarContext.Provider>;
}

export namespace ScrollAreaScrollbar {
    export type State = {
        /** Whether the scroll area is being hovered. */
        hovering: boolean;
        /** Whether the scroll area is being scrolled. */
        scrolling: boolean;
        /** The orientation of the scrollbar. */
        orientation: 'vertical' | 'horizontal';
    } & ScrollAreaRoot.State;

    export type Props = {
        /**
         * Whether the scrollbar controls vertical or horizontal scroll.
         * @default 'vertical'
         */
        orientation?: 'vertical' | 'horizontal';
        /**
         * Whether to keep the HTML element in the DOM when the viewport isn’t scrollable.
         * @default false
         */
        keepMounted?: boolean;
    } & HeadlessUIComponentProps<'div', ScrollAreaScrollbar.State>;
}
