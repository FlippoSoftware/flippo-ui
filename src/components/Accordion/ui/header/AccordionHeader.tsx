import React from 'react';

import { Accordion as AccordionHeadless } from '@flippo-ui/headless-components/accordion';
import { cx } from 'class-variance-authority';

import styles from './AccordionHeader.module.scss';

export function AccordionHeader(props: AccordionHeader.Props) {
    const { className, ...otherProps } = props;

    return <AccordionHeadless.Header {...otherProps} className={cx(styles.AccordionHeader, className)} />;
}

export namespace AccordionHeader {
    export type Props = AccordionHeadless.Header.Props;
}
