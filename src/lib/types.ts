import type React from 'react';

export type HTMLProps<T = any> = React.HTMLAttributes<T> & {
    ref?: React.Ref<T> | undefined;
};

export type HeadlessUIEvent<E extends React.SyntheticEvent<Element, Event>> = E & {
    preventHeadlessUIHandler: () => void;
    readonly headlessUIHandlerPrevented?: boolean;
};

export type WithPreventHeadlessUIHandler<T> = T extends (event: infer E) => any
    ? E extends React.SyntheticEvent<Element, Event>
        ? (event: HeadlessUIEvent<E>) => ReturnType<T>
        : T
    : T extends undefined
        ? undefined
        : T;

/**
 * Adds a `preventHeadlessUIHandler` method to all event handlers.
 */
export type WithHeadlessUIEvent<T> = {
    [K in keyof T]: WithPreventHeadlessUIHandler<T[K]>;
};

/**
 * Shape of the render prop: a function that takes props to be spread on the element and component's state and returns a React element.
 *
 * @template Props Props to be spread on the rendered element.
 * @template State Component's internal state.
 */
export type ComponentRenderFn<Props, State> = (
    props: Props,
    state: State,
) => React.ReactElement<unknown>;

/**
 * Props shared by all Headless UI components.
 * Contains `className` (string or callback taking the component's state as an argument) and `render` (function to customize rendering).
 */
export type HeadlessUIComponentProps<
    ElementType extends React.ElementType,
    State,
    RenderFunctionProps = HTMLProps
> = Omit<
    WithHeadlessUIEvent<React.ComponentPropsWithoutRef<ElementType>>,
    'className' | 'color' | 'defaultValue' | 'defaultChecked'
> & {
    ref?: React.Ref<HTMLElement> | undefined;
    /**
     * CSS class applied to the element, or a function that
     * returns a class based on the component’s state.
     */
    className?: string | ((state: State) => string);
    /**
     * Allows you to replace the component’s HTML element
     * with a different tag, or compose it with another component.
     *
     * Accepts a `ReactElement` or a function that returns the element to render.
     */
    render?:
      | ComponentRenderFn<RenderFunctionProps, State>
      | React.ReactElement<Record<string, unknown>>;

    /**
     * Should a component pass all props to a single child component?
     *
     * Set to `true` if you want to ignore the component and pass all props to the child component
     */
    asChild?: boolean;
};

export type Simplify<T> = T extends Function ? T : { [K in keyof T]: T[K] };

export type RequiredExcept<T, K extends keyof T> = Required<Omit<T, K>> & Pick<T, K>;

export type Orientation = 'horizontal' | 'vertical';

export type NativeButtonProps = {
    /**
     * Whether the component renders a native `<button>` element when replacing it
     * via the `render` prop.
     * Set to `false` if the rendered element is not a button (e.g. `<div>`).
     * @default true
     */
    nativeButton?: boolean;
};

export type NonNativeButtonProps = {
    /**
     * Whether the component renders a native `<button>` element when replacing it
     * via the `render` prop.
     * Set to `true` if the rendered element is a native button.
     * @default false
     */
    nativeButton?: boolean;
};

export type EventKey
    = | 'ArrowDown'
      | 'ArrowUp'
      | 'ArrowLeft'
      | 'ArrowRight'
      | 'Space'
      | 'Enter'
      | 'Comma'
      | 'Escape'
      | 'Backspace'
      | 'Delete'
      | 'Home'
      | 'End'
      | 'Tab'
      | 'PageUp'
      | 'PageDown'
      | (string & {});

export type EventKeyMap<T extends HTMLElement = HTMLElement> = {
    [key in EventKey]?: (event: React.KeyboardEvent<T>) => void
};

export type NativeEvent<E>
    = React.ChangeEvent<any> extends E ? InputEvent : E extends React.SyntheticEvent<any, infer T> ? T : never;
