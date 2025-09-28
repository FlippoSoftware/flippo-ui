import React from 'react';

import { Accordion as AccordionHeadless } from '@flippo-ui/headless-components/accordion';
import { cx } from 'class-variance-authority';

import styles from './AccordionTrigger.module.scss';

export function AccordionTrigger(props: AccordionTrigger.Props) {
    const { className, ...otherProps } = props;

    return <AccordionHeadless.Trigger {...otherProps} className={cx(styles.AccordionTrigger, className)} />;
}

AccordionTrigger.Svg = AccordionTriggerSvg;

export namespace AccordionTrigger {
    export type Props = AccordionHeadless.Trigger.Props;
}

function AccordionTriggerSvg(props: React.SVGProps<SVGSVGElement>) {
    const { className, ...otherProps } = props;
    return (
        <svg viewBox={'0 0 12 12'} fill={'currentcolor'} {...otherProps} className={cx(styles.AccordionTriggerSvg, className)}>
            <path d={'M6.75 0H5.25V5.25H0V6.75L5.25 6.75V12H6.75V6.75L12 6.75V5.25H6.75V0Z'} />
        </svg>
    );
}
