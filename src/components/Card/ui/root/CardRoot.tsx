import React from 'react';
import type * as ReactTypes from 'react';

import { useRender } from '@flippo-ui/headless-components';
import { cx } from 'class-variance-authority';

import { extractBoxProps } from '~@lib/layouts';

import type { BoxProps } from '~@lib/types';

import { CardContext } from './CardContext';
import styles from './CardRoot.module.scss';

/**
 * CardRoot - Root container for Card component.
 * Provides context for Title and Description to connect via aria-labelledby and aria-describedby.
 */
export function CardRoot<ElementType extends keyof ReactTypes.JSX.IntrinsicElements = 'div'>(
    props: CardRoot.Props<ElementType>
) {
    const {
        as: Tag = 'div',
        ref,
        className,
        ...restProps
    } = props;

    const titleId = React.useId();
    const descriptionId = React.useId();

    const { style, otherProps } = extractBoxProps(restProps);

    const contextValue = React.useMemo(
        () => ({ titleId, descriptionId }),
        [titleId, descriptionId]
    );

    const element = useRender({
        defaultTagName: Tag,
        ref: ref as React.Ref<Element>,
        props: [{
            style,
            'className': cx(styles.CardRoot, className),
            'aria-labelledby': titleId,
            'aria-describedby': descriptionId
        }, otherProps]
    });

    return <CardContext.Provider value={contextValue}>{element}</CardContext.Provider>;
}

export type CardRootProps<ElementType extends keyof React.JSX.IntrinsicElements = 'div'>
  = React.PropsWithChildren<React.ComponentPropsWithRef<ElementType>>
    & BoxProps
    & {
        /** HTML element to render */
        as?: ElementType;
        /** Additional CSS class */
        className?: string;
    };

export namespace CardRoot {
    export type Props<ElementType extends keyof React.JSX.IntrinsicElements = 'div'> = CardRootProps<ElementType>;
}
