import type { ComponentPropsWithRef, ElementType } from 'react';

// Для экспорта полиморфных типов в других компонентах
export type PolymorphicComponentProps<
    T extends ElementType,
    Props = Record<string, unknown>
> = Props & ComponentPropsWithRef<T> & { as?: T };

export type PolymorphicComponentPropsWithRef<
    T extends ElementType,
    Props = Record<string, unknown>
> = PolymorphicComponentProps<T, Props>;
