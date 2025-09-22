import React from 'react';

import { Toggle as ToggleHeadless } from '@flippo-ui/headless-components/toggle';
import { cva } from 'class-variance-authority';

import styles from './Toggle.module.scss';

const ToggleVariants = cva(styles.Toggle, {
    variants: {
        variant: {
            inverted: styles.Toggle_inverted,
            light: styles.Toggle_light
        }
    }
});

export function Toggle(props: Toggle.Props) {
    const { className, ...rest } = props;

    const toggleClasses = ToggleVariants({ className });

    return <ToggleHeadless {...rest} className={toggleClasses} />;
}

export namespace Toggle {
    export type Props = ToggleHeadless.Props;
}
