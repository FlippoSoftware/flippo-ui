export type * from '@flippo-software/component-styles/layouts';

import type { ComponentPropsWithRef, ElementType } from 'react';
export type PolymorphicComponentProps<T extends ElementType, Props = Record<string, unknown>> = Props &
    ComponentPropsWithRef<T> & { as?: T };
export type PolymorphicComponentPropsWithRef<T extends ElementType = 'div', Props = Record<string, unknown>> = PolymorphicComponentProps<
    T,
    Props
>;
