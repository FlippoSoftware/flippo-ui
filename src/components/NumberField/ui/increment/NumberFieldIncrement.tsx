import React from 'react';

import { NumberField as NumberFieldHeadless } from '@flippo-ui/headless-components/number-field';
import { cx } from 'class-variance-authority';

import styles from './NumberFieldIncrement.module.scss';

export function NumberFieldIncrement(props: NumberFieldIncrement.Props) {
    const { className, ...otherProps } = props;

    return <NumberFieldHeadless.Increment {...otherProps} className={cx(styles.NumberFieldIncrement, className)} />;
}

NumberFieldIncrement.Svg = IncrementSvg;

export namespace NumberFieldIncrement {
    export type Props = NumberFieldHeadless.Increment.Props;
}

function IncrementSvg(props: React.ComponentProps<'svg'>) {
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
            <path d={'M0 5H5M10 5H5M5 5V0M5 5V10'} />
        </svg>
    );
}
