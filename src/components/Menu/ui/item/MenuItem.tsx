import React from 'react';

import { Menu as MenuHeadless } from '@flippo-ui/headless-components/menu';
import { cva } from 'class-variance-authority';

import type { VariantProps } from 'class-variance-authority';

import styles from './MenuItem.module.scss';

const MenuItemVariants = cva(styles.MenuItem, {
    variants: {
        variant: {
            destructive: { true: styles.MenuItem_destructive, false: false }
        }
    }
});

export function MenuItem(props: MenuItem.Props) {
    const { className, variant, ...otherProps } = props;

    const menuItemClasses = MenuItemVariants({ variant, className });

    return <MenuHeadless.Item {...otherProps} className={menuItemClasses} />;
}

export namespace MenuItem {
    export type Props = MenuHeadless.Item.Props & VariantProps<typeof MenuItemVariants>;
}
