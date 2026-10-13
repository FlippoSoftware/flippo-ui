'use client';
import type * as React from 'react';

import { skeletonText } from '@flippo-software/component-styles/skeleton-text';

import type { RecipeVariants } from '~@lib/Styled';

export type SkeletonTextProps = React.ComponentPropsWithRef<'span'> &
    RecipeVariants<typeof skeletonText> & {
        /** The number of lines. @default 3 */
        lines?: number;
        /** Extra space between the lines (they already have the line height of the text). */
        gap?: React.CSSProperties['gap'];
    };

/** A placeholder for a paragraph: one bar per line, sized by the current font. */
export function SkeletonText({ lines = 3, gap, className, animation, style, ...props }: SkeletonTextProps): React.ReactElement {
    const classes = skeletonText({ animation });
    const count = Math.max(1, Math.floor(lines));
    return (
        <span
            aria-hidden='true'
            {...props}
            className={[classes.root, className].filter(Boolean).join(' ')}
            style={
                {
                    ...(gap === undefined ? {} : { '--fl-skeleton-text-gap': typeof gap === 'number' ? `${gap}px` : gap }),
                    ...style
                } as React.CSSProperties
            }
        >
            {Array.from({ length: count }, (_, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: the lines are identical placeholders
                <span key={index} className={classes.line} />
            ))}
        </span>
    );
}
