import React from 'react';

import { NumberField as NumberFieldHeadless } from '@flippo-ui/headless-components/number-field';
import { cx } from 'class-variance-authority';

import styles from './NumberFieldDecrement.module.scss';

export function NumberFieldDecrement(props: NumberFieldDecrement.Props) {
    const { className, ...otherProps } = props;

    return <NumberFieldHeadless.Decrement {...otherProps} className={cx(styles.NumberFieldDecrement, className)} />;
}

NumberFieldDecrement.Svg = DecrementSvg;

export namespace NumberFieldDecrement {
    export type Props = NumberFieldHeadless.Decrement.Props;
}

function DecrementSvg(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            width={'10'}
            height={'10'}
            viewBox={'0 0 10 10'}
            fill={'none'}
            stroke={'currentcolor'}
            strokeWidth={'1.6'}
            xmlns={'http://www.w3.org/2000/svg'}
            {...props}
        >
            <path d={'M0 5H10'} />
        </svg>
    );
}
