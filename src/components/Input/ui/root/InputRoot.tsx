import type React from 'react';

import { useRender } from '@flippo-ui/headless-components/use-render';
import { cva } from 'class-variance-authority';

import type { VariantProps } from 'class-variance-authority';

import styles from './InputRoot.module.scss';

const InputRootVariants = cva(styles.InputRoot, {
    variants: {
        variant: {
            default: styles.default,
            underline: styles.underline
        },
        size: {
            small: styles.small,
            medium: styles.medium,
            large: styles.large
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'large'
    }
});

export function InputRoot(props: InputRoot.Props) {
    const { className, variant, ...otherProps } = props;

    const inputRootClassName = InputRootVariants({
        variant,
        className
    });

    const element = useRender({ defaultTagName: 'span', props: [otherProps, { className: inputRootClassName }] });

    return element;
}

export namespace InputRoot {
    export type Props = React.ComponentPropsWithRef<'span'> & VariantProps<typeof InputRootVariants>;
}
