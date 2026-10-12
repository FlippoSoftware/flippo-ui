import React from 'react';

import { ScrollAreaMachine } from '@flippo-software/core-components/scroll-area';

import { toReactProps, useMachine, useStoreState } from '~@lib/core';
import { useDirection, useHeadlessUiId } from '~@lib/hooks';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { styleDisableScrollbar } from '~@lib/styles';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useCSPContext } from '../../CSPProvider/CSPContext';

import { ScrollAreaRootContext } from './ScrollAreaRootContext';
import { scrollAreaStateAttributesMapping } from './stateAttributes';

import type { ScrollAreaRootContextValue } from './ScrollAreaRootContext';

export type HiddenState = { x: boolean; y: boolean; corner: boolean };
export type OverflowEdges = { xStart: boolean; xEnd: boolean; yStart: boolean; yEnd: boolean };
export type Size = { width: number; height: number };
export type Coords = { x: number; y: number };

export function ScrollAreaRoot(componentProps: ScrollAreaRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        overflowEdgeThreshold,
        ref,
        ...elementProps
    } = componentProps;

    const rootId = useHeadlessUiId();
    const direction = useDirection();
    const { nonce, disableStyleElements } = useCSPContext();

    const scrollArea = useMachine((options) => new ScrollAreaMachine(options), { overflowEdgeThreshold, direction, rootId });
    const storeState = useStoreState(scrollArea.store);

    // Derived from `storeState`, so it is up to date whenever the store changes.
    const state: ScrollAreaRoot.State = scrollArea.getState();

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, scrollArea.setRoot],
        props: [toReactProps(scrollArea.getRootProps()), elementProps],
        customStyleHookMapping: scrollAreaStateAttributesMapping
    });

    // A new value on every store change, so the parts follow the machine.
    const contextValue: ScrollAreaRootContextValue = React.useMemo(
        () => ({
            scrollArea,
            hovering: storeState.hovering,
            scrollingX: storeState.scrollingX,
            scrollingY: storeState.scrollingY,
            touchModality: storeState.touchModality,
            cornerSize: storeState.cornerSize,
            thumbSize: storeState.thumbSize,
            hiddenState: storeState.hiddenState,
            overflowEdges: storeState.overflowEdges,
            viewportState: scrollArea.getState()
        }),
        [scrollArea, storeState]
    );

    return (
        <ScrollAreaRootContext.Provider value={contextValue}>
            {!disableStyleElements && styleDisableScrollbar.getElement(nonce)}
            {element}
        </ScrollAreaRootContext.Provider>
    );
}

export namespace ScrollAreaRoot {
    export type State = {
        /** Whether horizontal overflow is present. */
        hasOverflowX: boolean;
        /** Whether vertical overflow is present. */
        hasOverflowY: boolean;
        /** Whether there is overflow on the inline start side for the horizontal axis. */
        overflowXStart: boolean;
        /** Whether there is overflow on the inline end side for the horizontal axis. */
        overflowXEnd: boolean;
        /** Whether there is overflow on the block start side. */
        overflowYStart: boolean;
        /** Whether there is overflow on the block end side. */
        overflowYEnd: boolean;
        /** Whether the scrollbar corner is hidden. */
        cornerHidden: boolean;
    };
    export type Props = {
        /**
         * The threshold in pixels that must be passed before the overflow edge attributes are applied.
         * Accepts a single number for all edges or an object to configure them individually.
         * @default 0
         */
        overflowEdgeThreshold?:
            | number
            | Partial<{
                  xStart: number;
                  xEnd: number;
                  yStart: number;
                  yEnd: number;
              }>;
    } & HeadlessUIComponentProps<'div', ScrollAreaRoot.State>;
}
