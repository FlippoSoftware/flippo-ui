import React from 'react';

import { Input as InputHeadless } from '@flippo-ui/headless-components/input';
import { useRender } from '@flippo-ui/headless-components/use-render';
import { cva } from 'class-variance-authority';

import type { VariantProps } from 'class-variance-authority';

import styles from './InputBody.module.scss';

const InputBodyInvertedVariants = cva(styles.InputBody, {
    variants: {
        variant: {
            inverted: styles.InputBody_inverted,
            light: styles.InputBody_light
        },
        dimensions: {
            small: styles.InputBody_small,
            medium: styles.InputBody_medium,
            large: styles.InputBody_large
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
        dimensions: 'large',
        corners: 'circle'
    }
});

const InputBodyUnderlineVariants = cva(styles.InputBody, {
    variants: {
        variant: {
            underline: styles.InputBody_underline
        },
        view: {
            invisible: styles.InputBody_underline_invisible,
            affordance: styles.InputBody_underline_affordance
        }
    },
    defaultVariants: {
        variant: 'underline',
        view: 'invisible'
    }
});

export function InputBody(props: InputBody.Props) {
    const {
        ref,
        className,
        variant = 'inverted',
        ...otherProps
    } = props;

    const { state } = InputHeadless.useInputControl();

    const dimensions = 'dimensions' in props ? props.dimensions : undefined;
    const corners = 'corners' in props ? props.corners : undefined;
    const view = 'view' in props ? props.view : undefined;

    const inputRootClassName = React.useMemo(() =>
        variant === 'underline'
            ? InputBodyUnderlineVariants({
                variant,
                view,
                className
            })
            : InputBodyInvertedVariants({
                variant,
                dimensions,
                corners,
                className
            }), [
        variant,
        dimensions,
        corners,
        className,
        view
    ]);

    const element = useRender({
        defaultTagName: 'span',
        ref,
        state,
        props: [otherProps, { className: inputRootClassName }]
    });

    return element;
}

export namespace InputBody {
    export type InvertedProps = React.ComponentPropsWithRef<'span'> & VariantProps<typeof InputBodyInvertedVariants>;
    export type UnderlineProps = React.ComponentPropsWithRef<'span'> & VariantProps<typeof InputBodyUnderlineVariants>;

    export type Props = InvertedProps | UnderlineProps;
}
