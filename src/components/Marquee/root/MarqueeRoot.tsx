import React from 'react';

import { useIsoLayoutEffect, useOnMount } from '@flippo-ui/hooks';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, Orientation } from '~@lib/types';

import { MarqueeRootContext } from './MarqueeRootContext';
import { MarqueeRootCssVars } from './MarqueeRootCssVars';

import type { MarqueeRootContextValue } from './MarqueeRootContext';

export function MarqueeRoot(
    componentProps: MarqueeRoot.Props
) {
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

    const vertical = orientation === 'vertical';

    // Refs
    const rootRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

    // State
    const [containerSize, setContainerSize] = React.useState(0);
    const [marqueeSize, setMarqueeSize] = React.useState(0);
    const [multiplier, setMultiplier] = React.useState(1);
    const [isMounted, setIsMounted] = React.useState(false);

    // Calculate size of container and marquee content
    const calculateSize = React.useCallback(() => {
        if (!contentRef.current || !rootRef.current) {
            return;
        }

        const containerRect = rootRef.current.getBoundingClientRect();
        const contentRect = contentRef.current.getBoundingClientRect();

        const newContainerSize = vertical ? containerRect.height : containerRect.width;
        const newMarqueeSize = vertical ? contentRect.height : contentRect.width;

        if (autoFill && newContainerSize && newMarqueeSize) {
            setMultiplier(
                newMarqueeSize < newContainerSize
                    ? Math.ceil(newContainerSize / newMarqueeSize)
                    : 1
            );
        }
        else {
            setMultiplier(1);
        }

        setContainerSize(newContainerSize);
        setMarqueeSize(newMarqueeSize);
    }, [autoFill, vertical]);

    // Calculate size on mount and resize
    useIsoLayoutEffect(() => {
        if (!isMounted || !contentRef.current || !rootRef.current) {
            return;
        }

        calculateSize();

        const resizeObserver = new ResizeObserver(calculateSize);
        resizeObserver.observe(rootRef.current);
        resizeObserver.observe(contentRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [calculateSize, isMounted]);

    // Recalculate when children change
    useIsoLayoutEffect(() => {
        calculateSize();
    }, [calculateSize, children]);

    useIsoLayoutEffect(() => {
        setIsMounted(true);
    }, []);

    useOnMount(() => onMount?.());

    // Animation duration calculation
    const duration = React.useMemo(() => {
        if (autoFill) {
            return (marqueeSize * multiplier) / speed;
        }
        return marqueeSize < containerSize
            ? containerSize / speed
            : marqueeSize / speed;
    }, [
        autoFill,
        containerSize,
        marqueeSize,
        multiplier,
        speed
    ]);

    // Container styles - functional styles for marquee behavior
    const containerStyle = React.useMemo<React.CSSProperties>(
        () => ({
            // Functional styles (required for marquee to work)
            overflow: 'hidden',
            display: 'flex',
            flexDirection: vertical ? 'column' : 'row',
            position: 'relative',

            // CSS variables for animation control
            [MarqueeRootCssVars.PauseOnHover]: !play || pauseOnHover ? 'paused' : 'running',
            [MarqueeRootCssVars.PauseOnClick]:
                !play || (pauseOnHover && !pauseOnClick) || pauseOnClick ? 'paused' : 'running',
            [MarqueeRootCssVars.Play]: play ? 'running' : 'paused',
            [MarqueeRootCssVars.Direction]: direction,
            [MarqueeRootCssVars.Orientation]: orientation,
            [MarqueeRootCssVars.Duration]: `${duration}s`,
            [MarqueeRootCssVars.Delay]: `${delay}s`,
            [MarqueeRootCssVars.IterationCount]: loop ? `${loop}` : 'infinite',
            [MarqueeRootCssVars.MinWidth]: vertical ? undefined : (autoFill ? 'auto' : '100%')
        }),
        [
            play,
            pauseOnHover,
            pauseOnClick,
            direction,
            orientation,
            duration,
            delay,
            loop,
            autoFill,
            vertical
        ]
    );

    const state: MarqueeRoot.State = React.useMemo(
        () => ({
            playing: play,
            orientation,
            direction
        }),
        [play, orientation, direction]
    );

    const element = useRenderElement('div', componentProps, {
        enabled: isMounted,
        state,
        ref: [ref, rootRef],
        props: [{ style: containerStyle, children }, elementProps]
    });

    const contextValue = React.useMemo<MarqueeRootContextValue>(
        () => ({
            contentRef,
            multiplier,
            orientation,
            onAnimationIteration: onCycleComplete,
            onAnimationEnd: onFinish
        }),
        [multiplier, orientation, onCycleComplete, onFinish]
    );

    if (!isMounted) {
        return null;
    }

    return (
        <MarqueeRootContext value={contextValue}>
            {element}
        </MarqueeRootContext>
    );
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
