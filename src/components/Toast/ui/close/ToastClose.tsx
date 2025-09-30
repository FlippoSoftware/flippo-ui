import React from 'react';

import { Toast as ToastHeadless } from '@flippo-ui/headless-components/toast';
import { cx } from 'class-variance-authority';

import styles from './ToastClose.module.scss';

export function ToastClose(props: ToastClose.Props) {
    const { className, ...otherProps } = props;

    return <ToastHeadless.Close {...otherProps} className={cx(styles.ToastClose, className)} />;
}

ToastClose.Svg = ToastCloseSvg;

export namespace ToastClose {
    export type Props = ToastHeadless.Close.Props;
}

function ToastCloseSvg(props: React.ComponentProps<'svg'>) {
    const { className, ...otherProps } = props;

    return (
        <svg
            xmlns={'http://www.w3.org/2000/svg'}
            width={'24'}
            height={'24'}
            viewBox={'0 0 24 24'}
            fill={'none'}
            stroke={'currentColor'}
            strokeWidth={'2'}
            strokeLinecap={'round'}
            strokeLinejoin={'round'}
            {...otherProps}
            className={cx(styles.ToastCloseSvg, className)}
        >
            <path d={'M18 6 6 18'} />
            <path d={'m6 6 12 12'} />
        </svg>
    );
}
