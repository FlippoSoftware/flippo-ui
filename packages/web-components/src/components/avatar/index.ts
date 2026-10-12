import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { AvatarFallbackElement } from './fallback/AvatarFallbackElement';
import { AvatarImageElement } from './image/AvatarImageElement';
import { AvatarElement } from './root/AvatarElement';

export * from './fallback/AvatarFallbackElement';
export * from './image/AvatarImageElement';
export * from './root/AvatarElement';
export * from './root/AvatarRootContext';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: AvatarElement,
    image: AvatarImageElement,
    fallback: AvatarFallbackElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-avatar…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('avatar', elements, options);
}
