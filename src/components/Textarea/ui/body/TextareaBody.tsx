import type React from 'react';

import { Input as InputHeadless } from '@flippo-ui/headless-components/input';
import { useRender } from '@flippo-ui/headless-components/use-render';
import { cva } from 'class-variance-authority';

import type { VariantProps } from 'class-variance-authority';

import styles from './TextareaBody.module.scss';

const TextareaBodyVariants = cva(styles.TextareaBody, {
    variants: {
        variant: {
            inverted: styles.TextareaBody_inverted,
            light: styles.TextareaBody_light
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
        corners: 'round'
    }
});

export function TextareaBody(props: TextareaBody.Props) {
    const {
        ref,
        className,
        variant = 'inverted',
        corners = 'round',
        ...otherProps
    } = props;

    const { state } = InputHeadless.useInputControl();

    const textareaBodyClassName = TextareaBodyVariants({
        variant,
        corners,
        className
    });

    const element = useRender({
        defaultTagName: 'span',
        ref,
        state,
        props: [otherProps, { className: textareaBodyClassName }]
    });

    return element;
}

export namespace TextareaBody {
    export type Props = React.ComponentPropsWithRef<'span'> & VariantProps<typeof TextareaBodyVariants>;
}
