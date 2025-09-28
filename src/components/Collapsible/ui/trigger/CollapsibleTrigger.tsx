import React from 'react';

import { Collapsible as CollapsibleHeadless } from '@flippo-ui/headless-components/collapsible';
import { cx } from 'class-variance-authority';

import styles from './CollapsibleTrigger.module.scss';

export function CollapsibleTrigger(props: CollapsibleTrigger.Props) {
    const { className, ...otherProps } = props;

    return <CollapsibleHeadless.Trigger {...otherProps} className={cx(styles.CollapsibleTrigger, className)} />;
}

CollapsibleTrigger.Svg = CollapsibleTriggerSvg;

export namespace CollapsibleTrigger {
    export type Props = CollapsibleHeadless.Trigger.Props;
}

function CollapsibleTriggerSvg(props: React.SVGProps<SVGSVGElement>) {
    const { className, ...otherProps } = props;
    return (
        <svg width={'10'} height={'10'} viewBox={'0 0 10 10'} fill={'none'} {...otherProps} className={cx(styles.CollapsibleTriggerSvg, className)}>
            <path d={'M3.5 9L7.5 5L3.5 1'} stroke={'currentcolor'} />
        </svg>
    );
}
