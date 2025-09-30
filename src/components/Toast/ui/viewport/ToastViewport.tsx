import React from 'react';

import { Toast as ToastHeadless } from '@flippo-ui/headless-components/toast';
import { cva } from 'class-variance-authority';

import type { VariantProps } from 'class-variance-authority';

import styles from './ToastViewport.module.scss';

const ToastViewportVariants = cva(styles.ToastViewport, {
    variants: {
        position: {
            'bottom-left': styles['ToastViewport_bottom-left'],
            'bottom': styles.ToastViewport_bottom,
            'bottom-right': styles['ToastViewport_bottom-right']
        }
    },
    defaultVariants: {
        position: 'bottom'
    }
});

export function ToastViewport(props: ToastViewport.Props) {
    const { className, position = 'bottom', ...otherProps } = props;

    const toastViewportClasses = ToastViewportVariants({ position, className });

    return <ToastHeadless.Viewport {...otherProps} className={toastViewportClasses} />;
}

export namespace ToastViewport {
    export type Props = ToastHeadless.Viewport.Props & VariantProps<typeof ToastViewportVariants>;
}
