import React from 'react';

import { Dialog as DialogHeadless } from '@flippo-ui/headless-components/dialog';
import { cva } from 'class-variance-authority';

import type { VariantProps } from 'class-variance-authority';

import styles from './DialogPopup.module.scss';

const DialogPopupVariants = cva(styles.DialogPopup, {
    variants: {
        dimension: {
            small: styles.DialogPopup_small,
            medium: styles.DialogPopup_medium,
            large: styles.DialogPopup_large

        }
    },
    defaultVariants: {
        dimension: 'medium'
    }
});

export function DialogPopup(props: DialogPopup.Props) {
    const { className, dimension, ...otherProps } = props;

    const dialogPopupClasses = DialogPopupVariants({ dimension, className });

    return <DialogHeadless.Popup {...otherProps} className={dialogPopupClasses} />;
}

export namespace DialogPopup {
    export type Props = DialogHeadless.Popup.Props & VariantProps<typeof DialogPopupVariants>;
}
