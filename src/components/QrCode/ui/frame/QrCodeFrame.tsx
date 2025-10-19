import React from 'react';

import { QrCode as QrCodeHeadless } from '@flippo-ui/headless-components/qr-code';
import { cx } from 'class-variance-authority';

import styles from './QrCodeFrame.module.scss';

export function QrCodeFrame(props: QrCodeFrame.Props) {
    const { className, ...otherProps } = props;

    return <QrCodeHeadless.Frame {...otherProps} className={cx(styles.QrCodeFrame, className)} />;
}

export namespace QrCodeFrame {
    export type Props = QrCodeHeadless.Frame.Props;
}
