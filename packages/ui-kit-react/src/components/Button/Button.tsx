'use client';
import * as React from 'react';

import { button as recipe } from '@flippo-software/component-styles/button';
import { Button as Primitive } from '@flippo-ui/headless-components/button';

import { createStyler } from '../../lib/Styled';
import { Spinner } from '../Spinner';

import type { RecipeVariants, StyledProps } from '../../lib/Styled';

const StyledButton = createStyler(recipe, 'button')(Primitive, undefined, true);
type Variants = RecipeVariants<typeof recipe>;
type ExtraProps = { loading?: boolean; loader?: React.ReactNode; icon?: boolean };
export type ButtonProps = (
    | StyledProps<typeof Primitive, Variants>
    | (Omit<React.ComponentPropsWithRef<'a'>, keyof Variants> & Variants & { href: string })
) &
    ExtraProps;
export function Button({ loading = false, loader, icon, ...props }: ButtonProps): React.ReactElement {
    const { children, ...rest } = props;
    const forwarded: Record<string, unknown> = { ...rest, iconOnly: props.iconOnly ?? icon, 'aria-busy': loading || undefined };
    if ('href' in props) {
        // The headless render prop supplies the children and link attributes.
        forwarded.render = <a href={props.href}>{children}</a>;
        forwarded.nativeButton = false;
    }
    return React.createElement(
        StyledButton,
        forwarded,
        children,
        loading ? (loader ?? <Spinner size='small' color='current' aria-hidden='true' />) : null
    );
}
export namespace Button {
    export type Props = ButtonProps;
}
