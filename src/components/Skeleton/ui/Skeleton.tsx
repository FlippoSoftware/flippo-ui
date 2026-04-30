import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';
import { cva } from 'class-variance-authority';

import type { VariantProps } from 'class-variance-authority';

import styles from './Skeleton.module.scss';

const SkeletonVariants = cva(styles.Skeleton, {
    variants: {
        animate: {
            pulse: [styles.animate, styles.pulse],
            shimmer: [styles.animate, styles.shimmer],
            false: ''
        },
        circle: {
            true: styles.circle,
            false: ''
        }
    },
    defaultVariants: {
        animate: 'shimmer',
        circle: false
    }
});

/**
 * Skeleton - Loading placeholder component.
 * Displays an animated placeholder for content that is loading.
 *
 * @example
 * <Skeleton height={20} />
 *
 * @example
 * <Skeleton circle height={40} />
 *
 * @example
 * <Flex direction="column" gap={8}>
 *   <Skeleton height={24} width="60%" />
 *   <Skeleton height={16} />
 *   <Skeleton height={16} width="80%" />
 * </Flex>
 */
export function Skeleton(props: Skeleton.Props) {
    const {
        width = '100%',
        height = 16,
        radius,
        circle = false,
        animate = 'shimmer',
        className,
        ref,
        ...otherProps
    } = props;

    const skeletonClassName = SkeletonVariants({
        animate,
        circle,
        className
    });

    const style: React.CSSProperties = {
        width: circle ? height : width,
        height,
        borderRadius: radius
    };

    const element = useRender({
        defaultTagName: 'span',
        ref: ref as React.Ref<Element>,
        props: [{ style, className: skeletonClassName }, otherProps]
    });

    return element;
}

export namespace Skeleton {
    /**
     * Skeleton animation types
     */
    export type SkeletonAnimation = 'pulse' | 'shimmer' | false;

    export type Props = {
        /** Width of skeleton (defaults to 100%) */
        width?: React.CSSProperties['width'];
        /** Height of skeleton */
        height?: React.CSSProperties['height'];
        /** Border radius */
        radius?: React.CSSProperties['borderRadius'];
        /** If true, width and height will be equal (creates a circle) */
        circle?: boolean;
        /** Animation type or false to disable */
        animate?: SkeletonAnimation;
        /** Additional CSS class */
        className?: string;
    } & React.ComponentPropsWithRef<'span'> & VariantProps<typeof SkeletonVariants>;
}
