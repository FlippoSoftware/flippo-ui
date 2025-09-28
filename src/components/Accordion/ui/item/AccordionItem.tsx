import React from 'react';

import { Accordion as AccordionHeadless } from '@flippo-ui/headless-components/accordion';
import { cx } from 'class-variance-authority';

import styles from './AccordionItem.module.scss';

export function AccordionItem(props: AccordionItem.Props) {
    const { className, ...otherProps } = props;

    return <AccordionHeadless.Item {...otherProps} className={cx(styles.AccordionItem, className)} />;
}

export namespace AccordionItem {
    export type Props = AccordionHeadless.Item.Props;
}
