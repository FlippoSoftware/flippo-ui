import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';
import { cx } from 'class-variance-authority';

import type { PolymorphicComponentPropsWithRef } from '~@lib/types';

import styles from './CardFooter.module.scss';

/**
 * CardFooter - Footer area for card actions or additional content.
 */
export function CardFooter(props: CardFooter.Props) {
    const {
        as: Tag = 'div',
        ref,
        className,
        ...otherProps
    } = props;

    const cardFooterClasses = cx(styles.CardFooter, className);

    const element = useRender({ defaultTagName: Tag, ref, props: [{ className: cardFooterClasses }, otherProps] });

    return element;
}

export namespace CardFooter {
    export type Props = PolymorphicComponentPropsWithRef<'div'>;
}
