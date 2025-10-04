import React from 'react';

import { Select as SelectHeadless } from '@flippo-ui/headless-components/select';
import { cx } from 'class-variance-authority';

import styles from './SelectPopup.module.scss';

export function SelectPopup(props: SelectPopup.Props) {
    const { className, ...otherProps } = props;

    return <SelectHeadless.Popup {...otherProps} className={cx(styles.SelectPopup, className)} />;
}

export namespace SelectPopup {
    export type Props = SelectHeadless.Popup.Props;
}
