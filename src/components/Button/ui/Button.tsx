import React from 'react';

import { useButton } from '@flippo-ui/headless-components/use-button';
import { useRender } from '@flippo-ui/headless-components/use-render';
import { SpinnerIcon } from '@flippo-ui/icons';
import { cva } from 'class-variance-authority';

import type { VariantProps } from 'class-variance-authority';

import styles from './Button.module.scss';

const ButtonVariants = cva(styles.Button, {
    variants: {
        variant: {
            primary: styles.primary,
            secondary: styles.secondary,
            outlined: styles.outlined,
            label: styles.label,
            danger: styles.danger
        },
        size: {
            'x-small': styles['x-small'],
            'small': styles.small,
            'medium': styles.medium,
            'large': styles.large
        },
        corners: {
            'clear': styles['corners-clear-clear'],
            'circle': styles['corners-circle-circle'],
            'round-clear': styles['corners-round-clear'],
            'clear-round': styles['corners-clear-round'],
            'round-circle': styles['corners-round-circle'],
            'clear-circle': styles['corners-clear-circle']
        },
        loading: {
            true: styles.loading,
            false: false
        },
        icon: {
            true: styles.icon,
            false: false
        },
        link: {
            true: styles.link,
            false: false
        }
    },
    compoundVariants: [
        {
            size: 'x-small',
            icon: true,
            class: styles['icon-x-small']
        },
        {
            size: 'small',
            icon: true,
            class: styles['icon-small']
        },
        {
            size: 'medium',
            icon: true,
            class: styles['icon-medium']
        },
        {
            size: 'large',
            icon: true,
            class: styles['icon-large']
        }
    ],
    defaultVariants: {
        variant: 'primary',
        size: 'medium'
    }
});

// Overloaded function signatures for strict typing
export function Button(props: Button.LinkElementProps): React.JSX.Element;
export function Button(props: Button.ButtonElementProps): React.JSX.Element;
export function Button(props: Button.Props): React.JSX.Element {
    const {
        ref,
        loading = false,
        loader = <SpinnerIcon />,
        children,
        className,
        variant = 'primary',
        size = 'medium',
        corners = 'circle',
        icon = false,
        ...otherProps
    } = props;

    // Автоматическое определение типа по наличию href
    const isLink = 'href' in props && props.href != null;

    // Type guard для определения типа пропов
    const disabled = !isLink && 'disabled' in props ? props.disabled : false;

    const { getButtonProps, buttonRef } = useButton({
        native: !isLink,
        disabled: disabled || false
    });

    // Применяем стили через CVA
    const buttonClassName = ButtonVariants({
        variant,
        size,
        corners,
        loading,
        icon,
        link: isLink,
        className
    });

    // Определяем правильный элемент для рендера
    const Tag = isLink
        ? 'a'
        : 'button';

    const element = useRender({
        defaultTagName: Tag,
        ref: [buttonRef, ref],
        props: [getButtonProps(otherProps), { className: buttonClassName, children: (
            <React.Fragment>
                {children}
                {loading && loader}
            </React.Fragment>
        ) }]
    });

    return element;
}

export namespace Button {
    /**
     * Базовые пропы для Button/Link компонента
     */
    type BaseButtonProps = {
        loader?: React.ReactNode;
        children?: React.ReactNode;
        asChild?: boolean;
    } & VariantProps<typeof ButtonVariants>;

    // Типы для кнопки (с disabled, без href/target/rel)
    export type ButtonElementProps = BaseButtonProps
      & Omit<React.ComponentPropsWithRef<'button'>, 'type'> & {
          href?: never;
          target?: never;
          rel?: never;
      };

    // Типы для ссылки (с href, target, rel, без disabled)
    export type LinkElementProps = BaseButtonProps
      & Omit<React.ComponentPropsWithRef<'a'>, 'type'> & {
          href: string;
          disabled?: never;
      };

    // Discriminated Union - автоматическое определение по наличию href
    export type Props = ButtonElementProps | LinkElementProps;
}
