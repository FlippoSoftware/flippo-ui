import React from 'react';

import { Accordion as AccordionHeadless } from '@flippo-ui/headless-components/accordion';
import { cx } from 'class-variance-authority';

import styles from './AccordionPanel.module.scss';

export function AccordionPanel(props: AccordionPanel.Props) {
    const { className, ...otherProps } = props;

    return <AccordionHeadless.Panel {...otherProps} className={cx(styles.AccordionPanel, className)} />;
}

export namespace AccordionPanel {
    export type Props = AccordionHeadless.Panel.Props;
}
