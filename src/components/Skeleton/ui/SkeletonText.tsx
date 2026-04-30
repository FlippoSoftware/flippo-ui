import React from 'react';

import { Skeleton } from './Skeleton';

/**
 * SkeletonText - Multi-line text placeholder.
 * Displays multiple skeleton lines for paragraph-like content.
 *
 * @example
 * <SkeletonText lines={3} />
 *
 * @example
 * <SkeletonText lines={4} spacing={12} />
 */
export function SkeletonText(props: SkeletonText.Props) {
    const {
        lines = 3,
        spacing = 8,
        animate = 'shimmer',
        ...otherProps
    } = props;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing }}>
            {Array.from({ length: lines }).map((_, index) => {
                const isLast = index === lines - 1;
                const width = isLast ? '80%' : '100%';

                return (
                    <Skeleton
                      key={index}
                      height={16}
                      width={width}
                      animate={animate}
                      {...otherProps}
                    />
                );
            })}
        </div>
    );
}

export namespace SkeletonText {

    /**
     * SkeletonText props - multi-line text placeholder
     */
    export type Props = {
        /** Number of skeleton lines */
        lines?: number;
        /** Spacing between lines (in px) */
        spacing?: number;
        /** Animation type */
        animate?: Skeleton.SkeletonAnimation;
        /** Additional CSS class */
        className?: string;
    };

}
