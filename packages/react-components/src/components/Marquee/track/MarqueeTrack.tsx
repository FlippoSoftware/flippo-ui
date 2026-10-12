import React from 'react';

import { useRenderElement } from '~@lib/hooks';
import { mergeProps } from '~@lib/merge';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useMarqueeRootContext } from '../root/MarqueeRootContext';

/**
 * Animated track for marquee content that handles the duplication for seamless scrolling.
 * Renders two marquee tracks for infinite scroll effect.
 * Must be placed within `<Marquee.Root>`.
 */
export function MarqueeTrack(componentProps: MarqueeTrack.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        children: childrenProp,
        ...elementProps
    } = componentProps;

    const { marquee, multiplier, onAnimationIteration, onAnimationEnd } = useMarqueeRootContext();

    const trackStyle = marquee.getTrackStyle() as React.CSSProperties;

    // Hidden copy used to measure the content: out of the document flow but still measurable.
    const measureContainerStyle = marquee.getMeasureStyle() as React.CSSProperties;

    // Multiply children for seamless scrolling
    const multiplyChildren = React.useCallback(
        (count: number) => {
            const length = Number.isFinite(count) && count >= 0 ? count : 0;
            return Array.from({ length }, (_, i) => (
                <React.Fragment key={`copy-${i}`}>{React.Children.map(childrenProp, (child) => child)}</React.Fragment>
            ));
        },
        [childrenProp]
    );

    const children = React.useMemo(() => <>{multiplyChildren(multiplier)}</>, [multiplier, multiplyChildren]);

    const marqueeProps = mergeProps({ style: trackStyle }, elementProps);

    const element = useRenderElement('div', componentProps, {
        ref,
        props: [
            {
                children,
                onAnimationIteration,
                onAnimationEnd
            },
            marqueeProps,
            elementProps
        ]
    });

    return (
        <>
            {/* Hidden container for size measurement - not visible, doesn't affect layout */}
            <div style={measureContainerStyle} ref={marquee.setContent} aria-hidden={'true'}>
                {childrenProp}
            </div>
            {element}
            <div {...marqueeProps} className={typeof className === 'function' ? className({}) : className}>
                {children}
            </div>
        </>
    );
}

export namespace MarqueeTrack {
    export type State = {};

    export type Props = HeadlessUIComponentProps<'div', State>;
}
