import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';
import { cx } from 'class-variance-authority';

import type { PolymorphicComponentPropsWithRef } from '~@lib/types';

import styles from './CardContent.module.scss';

/**
 * CardContent - Main content area of the card.
 */
export function CardContent(props: CardContent.Props) {
    const {
        as: Tag = 'div',
        ref,
        className,
        ...otherProps
    } = props;

    const cardContentClasses = cx(styles.CardContent, className);

    const element = useRender({ defaultTagName: Tag, ref, props: [{ className: cardContentClasses }, otherProps] });

    return element;
}

export namespace CardContent {
    export type Props = PolymorphicComponentPropsWithRef<'div'>;
}
