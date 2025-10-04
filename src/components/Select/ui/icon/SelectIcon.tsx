import React from 'react';

import { Select as SelectHeadless } from '@flippo-ui/headless-components/select';
import { cx } from 'class-variance-authority';

import styles from './SelectIcon.module.scss';

export function SelectIcon(props: SelectIcon.Props) {
    const { className, ...otherProps } = props;

    return <SelectHeadless.Icon {...otherProps} className={cx(styles.SelectIcon, className)} />;
}

SelectIcon.Svg = SelectIconSvg;

export namespace SelectIcon {
    export type Props = SelectHeadless.Icon.Props;
}

function SelectIconSvg(props: React.ComponentProps<'svg'>) {
    const { className, ...otherProps } = props;

    return (
        <svg xmlns={'http://www.w3.org/2000/svg'} fill={'none'} viewBox={'0 0 24 24'} {...otherProps} className={cx(styles.ChevronIcon, className)}>
            <path fill={'currentColor'} d={'M12 14.975q-.2 0-.375-.062a.9.9 0 0 1-.325-.213l-4.6-4.6a.95.95 0 0 1-.275-.7q0-.425.275-.7a.95.95 0 0 1 .7-.275q.425 0 .7.275l3.9 3.9 3.9-3.9a.95.95 0 0 1 .7-.275q.425 0 .7.275a.95.95 0 0 1 .275.7.95.95 0 0 1-.275.7l-4.6 4.6q-.15.15-.325.213a1.1 1.1 0 0 1-.375.062'} />
        </svg>
    );
}
