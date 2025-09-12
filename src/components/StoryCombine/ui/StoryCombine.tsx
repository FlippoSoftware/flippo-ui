import React from 'react';

import { Separator } from '../../Separator';

import styles from './StoryCombine.module.scss';

export function StoryCombine<E extends object>(props: StoryCombine.Props<E>) {
    const {
        args,
        component,
        decorator,
        groups
    } = props;

    const Component = component;

    return (
        <ul className={styles.groups}>
            {groups.map((group, index) => (
                <li className={styles.group} key={group.name + index.toString()}>
                    <h2 className={styles.groupName}>{group.name}</h2>
                    <div className={styles.groupVariants}>
                        {group.variants.map((variant, index) => (
                            <React.Fragment key={group.name + variant.name + index.toString()}>
                                <div className={styles.variant} key={group.name + variant.name + index.toString()}>
                                    <h3 className={styles.variantName}>{variant.name}</h3>
                                    {variant.components.map((componentProps, index) => {
                                        const componentArgs: E = {
                                            ...args,
                                            ...group.groupArgs,
                                            ...variant.variantArgs,
                                            ...componentProps
                                        } as E;

                                        return (
                                            <div key={`${group.name + variant.name + index.toString()}-component`}>
                                                {decorator
                                                    ? decorator(Component, componentArgs)
                                                    : <Component {...componentArgs} />}
                                            </div>
                                        );
                                    })}
                                </div>
                                {index !== group.variants.length - 1 ? <Separator orientation={'vertical'} /> : null}
                            </React.Fragment>
                        ))}
                    </div>
                </li>
            ))}
        </ul>
    );
}

export namespace StoryCombine {
    export type Variant<E extends object> = {
        components: Partial<E>[];
        name: string;
        variantArgs?: Partial<E>;
    };

    export type Group<E extends object> = {
        groupArgs?: Partial<E>;
        name: string;
        variants: Variant<E>[];
    };

    export type Decorator<E extends object> = (component: React.ComponentType<E>, args?: Partial<E>) => React.ReactNode;

    export type Props<E extends object> = {
        args?: Partial<E>;
        component: React.ComponentType<E>;
        decorator?: Decorator<E>;
        groups: Group<E>[];
    };
}
