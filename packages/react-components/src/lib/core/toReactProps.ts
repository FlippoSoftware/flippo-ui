import type { HTMLProps } from '~@lib/types';

/**
 * Types props returned by a core prop getter as React props.
 *
 * Core handlers are typed with DOM events, but they are written to accept React's synthetic events too
 * (they read `nativeEvent` when present and otherwise only use members both share, like `target`,
 * `currentTarget`, `key` and `preventDefault()`). This is the one place where that is asserted.
 */
export function toReactProps(props: object): HTMLProps {
    return props as HTMLProps;
}
