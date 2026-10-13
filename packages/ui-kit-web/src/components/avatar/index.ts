import { avatar as recipe } from '@flippo-software/component-styles/avatar';
import * as Primitive from '@flippo-software/web-components/avatar';

import { registerElements } from '~@lib/register';
import { styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const AvatarElement: StyledConstructor<typeof Primitive.AvatarElement, typeof recipe> = styled(
    Primitive.AvatarElement,
    recipe,
    'avatar',
    'root',
    true
);
export const AvatarImageElement: StyledConstructor<typeof Primitive.AvatarImageElement, typeof recipe> = styled(
    Primitive.AvatarImageElement,
    recipe,
    'avatar',
    'image',
    false
);
export const AvatarFallbackElement: StyledConstructor<typeof Primitive.AvatarFallbackElement, typeof recipe> = styled(
    Primitive.AvatarFallbackElement,
    recipe,
    'avatar',
    'fallback',
    false
);
export const elements: {
    readonly root: typeof AvatarElement;
    readonly image: typeof AvatarImageElement;
    readonly fallback: typeof AvatarFallbackElement;
} = { root: AvatarElement, image: AvatarImageElement, fallback: AvatarFallbackElement } as const;
export function define(options: DefineOptions) {
    registerElements('avatar', elements, options);
}
export type AvatarElement = InstanceType<typeof AvatarElement>;
export type AvatarImageElement = InstanceType<typeof AvatarImageElement>;
export type AvatarFallbackElement = InstanceType<typeof AvatarFallbackElement>;
