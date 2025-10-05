import type React from 'react';

import { useRenderElement } from '~@lib/hooks';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { ComponentRenderFn, HTMLProps } from '~@lib/types';

/**
 * Renders a Base UI element.
 *
 * @public
 */
export function useRender<
    State extends Record<string, unknown>,
    RenderedElementType extends Element,
    Enabled extends boolean | undefined = undefined
>(
    params: useRender.Parameters<State, RenderedElementType, Enabled>
): useRender.ReturnValue<Enabled> {
    const renderParams = params as useRender.Parameters<State, RenderedElementType, Enabled> & {
        customStyleHookMapping?: StateAttributesMapping<State>;
    };

    renderParams.customStyleHookMapping = renderParams.stateAttributesMapping;

    return useRenderElement(renderParams.defaultTagName, renderParams, renderParams);
}

export namespace useRender {
    export type RenderProp<State = Record<string, unknown>>
        = | ComponentRenderFn<React.HTMLAttributes<any>, State>
          | React.ReactElement<Record<string, unknown>>;

    export type ElementProps<ElementType extends React.ElementType>
        = React.ComponentPropsWithRef<ElementType>;

    export type ComponentProps<
        ElementType extends React.ElementType,
        State = object,
        RenderFunctionProps = HTMLProps
    > = React.ComponentPropsWithRef<ElementType> & {
        /**
         * Allows you to replace the component’s HTML element
         * with a different tag, or compose it with another component.
         *
         * Accepts a `ReactElement` or a function that returns the element to render.
         */
        render?:
          | ComponentRenderFn<RenderFunctionProps, State>
          | React.ReactElement<Record<string, unknown>>;
    };

    export type Parameters<
        State,
        RenderedElementType extends Element,
        Enabled extends boolean | undefined
    > = {
        /**
         * The React element or a function that returns one to override the default element.
         */
        render?: RenderProp<State>;
        /**
         * The ref to apply to the rendered element.
         */
        ref?: React.Ref<RenderedElementType> | (React.Ref<RenderedElementType> | undefined)[];
        /**
         * The state of the component, passed as the second argument to the `render` callback.
         * State properties are automatically converted to data-* attributes.
         */
        state?: State;
        /**
         * Custom mapping for converting state properties to data-* attributes.
         * @example
         * { isActive: (value) => (value ? { 'data-is-active': '' } : null) }
         */
        stateAttributesMapping?: StateAttributesMapping<State>;
        /**
         * Props to be spread on the rendered element.
         * They are merged with the internal props of the component, so that event handlers
         * are merged, `className` strings and `style` properties are joined, while other external props overwrite the
         * internal ones.
         */
        props?: Record<string, unknown> | Record<string, unknown>[];
        /**
         * If `false`, the hook will skip most of its internal logic and return `null`.
         * This is useful for rendering a component conditionally.
         * @default true
         */
        enabled?: Enabled;
        /**
         * The default tag name to use for the rendered element when `render` is not provided.
         * @default 'div'
         */
        defaultTagName?: keyof React.JSX.IntrinsicElements;
        /**
         * If the value is `true`, all props will be passed to the single child component.
         * It is important that the render function has higher priority, so if asChild and
         * render are specified, render will be applied.
         * @default false
         */
        asChild?: boolean;

    };

    export type ReturnValue<Enabled extends boolean | undefined> = Enabled extends false
        ? null
        : React.ReactElement;
}
