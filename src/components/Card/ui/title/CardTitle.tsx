import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';
import { cx } from 'class-variance-authority';

import type { PolymorphicComponentPropsWithRef } from '~@lib/types';

import { useCardContext } from '../root/CardContext';

import styles from './CardTitle.module.scss';

/**
 * CardTitle - Card header title.
 * Automatically connected to Card.Root via context for accessibility.
 */
export function CardTitle(props: CardTitle.Props) {
    const {
        as: Tag = 'h3',
        ref,
        className,
        id: providedId,
        ...otherProps
    } = props;
    const context = useCardContext();

    const titleId = providedId ?? context.titleId;
    const cardTitleClasses = cx(styles.CardTitle, className);

    const element = useRender({ defaultTagName: Tag, ref, props: [{ className: cardTitleClasses, id: titleId }, otherProps] });

    return element;
}

export type CardTitleProps = React.ComponentPropsWithRef<'h3'>;

export namespace CardTitle {
    export type Props = PolymorphicComponentPropsWithRef<'h3'>;
}
