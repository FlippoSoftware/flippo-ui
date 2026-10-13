import React from 'react';

import { MarqueeMachine } from '@flippo-software/core-components/marquee';
import { useIsoLayoutEffect, useOnMount } from '@flippo-software/react-hooks';

import { useMachine, useStoreState } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, Orientation } from '~@lib/types';

import { MarqueeRootContext } from './MarqueeRootContext';

import type { MarqueeRootContextValue } from './MarqueeRootContext';

export function MarqueeRoot(componentProps: MarqueeRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        autoFill = true,
        play = true,
        pauseOnHover = true,
        pauseOnClick = false,
        orientation = 'horizontal',
        direction = 'normal',
        speed = 50,
        delay = 0,
        loop = 0,
        onFinish,
        onCycleComplete,
        onMount,
        children,
        ref,
        ...elementProps
    } = componentProps;

    const marquee = useMachine((options) => new MarqueeMachine(options), {
        autoFill,
        play,
        pauseOnHover,
        pauseOnClick,
        orientation,
        direction,
        speed,
        delay,
        loop
    });
    const { multiplier } = useStoreState(marquee.store);

    // The marquee renders after mounting: its size and copies depend on measuring the DOM.
    const [isMounted, setIsMounted] = React.useState(false);
    useIsoLayoutEffect(() => {
        setIsMounted(true);
    }, []);

    useOnMount(() => onMount?.());

    // The content's size may change with the children.
    useIsoLayoutEffect(() => {
        marquee.calculateSize();
    }, [marquee, children]);

    const state: MarqueeRoot.State = React.useMemo(() => ({ playing: play, orientation, direction }), [play, orientation, direction]);

    const element = useRenderElement('div', componentProps, {
        enabled: isMounted,
        state,
        ref: [ref, marquee.setRoot],
        props: [{ style: marquee.getRootStyle() as React.CSSProperties, children }, elementProps]
    });

    const contextValue = React.useMemo<MarqueeRootContextValue>(
        () => ({
            marquee,
            multiplier,
            orientation,
            onAnimationIteration: onCycleComplete,
            onAnimationEnd: onFinish
        }),
        [marquee, multiplier, orientation, onCycleComplete, onFinish]
    );

    if (!isMounted) {
        return null;
    }

    return <MarqueeRootContext value={contextValue}>{element}</MarqueeRootContext>;
}

export namespace MarqueeRoot {
    export type Direction = 'normal' | 'reverse';

    export type State = {
        /**
         * Whether the marquee is currently playing.
         */
        playing: boolean;
        /**
         * The orientation of the marquee (horizontal or vertical).
         */
        orientation: Orientation;
        /**
         * The animation direction (normal or reverse).
         */
        direction: Direction;
    };

    export type Props = {
        /**
         * Whether to automatically fill blank space in the marquee with copies of the children.
         * @default false
         */
        autoFill?: boolean;
        /**
         * Whether to play or pause the marquee.
         * @default true
         */
        play?: boolean;
        /**
         * Whether to pause the marquee when hovered.
         * @default false
         */
        pauseOnHover?: boolean;
        /**
         * Whether to pause the marquee when clicked.
         * @default false
         */
        pauseOnClick?: boolean;
        /**
         * The orientation of the marquee.
         * @default "horizontal"
         */
        orientation?: Orientation;
        /**
         * The animation direction.
         * - `normal`: left-to-right (horizontal) or top-to-bottom (vertical)
         * - `reverse`: right-to-left (horizontal) or bottom-to-top (vertical)
         * @default "normal"
         */
        direction?: Direction;
        /**
         * Speed calculated as pixels/second.
         * @default 50
         */
        speed?: number;
        /**
         * Duration to delay the animation after render, in seconds.
         * @default 0
         */
        delay?: number;
        /**
         * The number of times the marquee should loop, 0 is equivalent to infinite.
         * @default 0
         */
        loop?: number;
        /**
         * Callback for when the marquee finishes scrolling and stops. Only calls if loop is non-zero.
         */
        onFinish?: () => void;
        /**
         * Callback for when the marquee finishes a loop.
         */
        onCycleComplete?: () => void;
        /**
         * Callback invoked once the marquee has finished mounting.
         */
        onMount?: () => void;
    } & HeadlessUIComponentProps<'div', State>;
}
