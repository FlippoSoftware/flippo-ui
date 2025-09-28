import React from 'react';

import { Accordion as AccordionHeadless } from '@flippo-ui/headless-components/accordion';
import { cx } from 'class-variance-authority';

import styles from './AccordionRoot.module.scss';

export function AccordionRoot(props: AccordionRoot.Props) {
    const { className, ...otherProps } = props;

    return <AccordionHeadless.Root {...otherProps} className={cx(styles.AccordionRoot, className)} />;
}

export namespace AccordionRoot {
    export type Props = AccordionHeadless.Root.Props;
}
