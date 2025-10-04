import React from 'react';

import { Select as SelectHeadless } from '@flippo-ui/headless-components/select';
import { cx } from 'class-variance-authority';

import styles from './SelectItemIndicator.module.scss';

export function SelectItemIndicator(props: SelectItemIndicator.Props) {
    const { className, hidden = false, ...rest } = props;

    return (
        <SelectHeadless.ItemIndicator {...rest} hidden={hidden} className={cx(styles.SelectItemIndicator, className)} />
    );
}

SelectItemIndicator.Svg = SelectItemIndicatorSvg;

export namespace SelectItemIndicator {
    export type Props = SelectHeadless.ItemIndicator.Props;
}

function SelectItemIndicatorSvg(props: React.ComponentProps<'svg'>) {
    const { className, ...otherProps } = props;

    return (
        <svg xmlns={'http://www.w3.org/2000/svg'} fill={'none'} viewBox={'0 0 24 24'} {...otherProps} className={cx(styles.CheckIcon, className)}>
            <path fill={'currentColor'} d={'m9.55 15.15 8.475-8.475q.3-.3.7-.3t.7.3.3.713a.97.97 0 0 1-.3.712l-9.175 9.2q-.3.3-.7.3a.96.96 0 0 1-.7-.3L4.55 13a.93.93 0 0 1-.288-.712q.012-.412.313-.713.3-.3.713-.3.412 0 .712.3z'} />
        </svg>
    );
}
