import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';
import { cx } from 'class-variance-authority';

import type { PolymorphicComponentPropsWithRef } from '~@lib/types';

import { useCardContext } from '../root/CardContext';

import styles from './CardDescription.module.scss';

/**
 * CardDescription - Card subtitle or description text.
 * Automatically connected to Card.Root via context for accessibility.
 */
export function CardDescription(props: CardDescription.Props) {
    const {
        as: Tag = 'p',
        ref,
        className,
        id: providedId,
        ...otherProps
    } = props;

    const context = useCardContext();

    const descriptionId = providedId ?? context.descriptionId;
    const cardDescriptionClasses = cx(styles.CardDescription, className);

    const element = useRender({ defaultTagName: Tag, ref, props: [{ className: cardDescriptionClasses, id: descriptionId }, otherProps] });

    return element;
}

export namespace CardDescription {
    export type Props = PolymorphicComponentPropsWithRef<'p'>;
}
