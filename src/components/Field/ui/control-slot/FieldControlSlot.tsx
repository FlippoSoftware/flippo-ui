import React from 'react';

import { Field as FieldHeadless } from '@flippo-ui/headless-components/field';
import { cva } from 'class-variance-authority';

import type { VariantProps } from 'class-variance-authority';

import styles from './FieldControlSlot.module.scss';

const FieldControlSlotVariants = cva(styles.FieldControlSlot, {
    variants: {
        variant: {
            inverted: styles.FieldControlSlot_inverted,
            light: styles.FieldControlSlot_light
        },
        dimensions: {
            small: styles.FieldControlSlot_small,
            medium: styles.FieldControlSlot_medium,
            large: styles.FieldControlSlot_large
        },
        corners: {
            'clear': styles['corners-clear-clear'],
            'circle': styles['corners-circle-circle'],
            'round': styles['corners-round-round'],
            'round-clear': styles['corners-round-clear'],
            'clear-round': styles['corners-clear-round'],
            'round-circle': styles['corners-round-circle'],
            'clear-circle': styles['corners-clear-circle']
        }
    },
    defaultVariants: {
        variant: 'inverted',
        dimensions: 'medium',
        corners: 'round'
    }
});

export function FieldControlSlot(props: FieldControlSlot.Props) {
    const {
        className,
        variant,
        dimensions,
        corners,
        ...otherProps
    } = props;

    const fieldControlSlotClasses = FieldControlSlotVariants({
        variant,
        dimensions,
        corners,
        className
    });

    return <FieldHeadless.Control.Slot {...otherProps} className={fieldControlSlotClasses} />;
}

export namespace FieldControlSlot {
    export type Props = FieldHeadless.Control.InputSlotProps & VariantProps<typeof FieldControlSlotVariants>;
}
