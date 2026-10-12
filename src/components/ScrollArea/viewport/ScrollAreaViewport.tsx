import { toReactProps } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useScrollAreaRootContext } from '../root/ScrollAreaRootContext';
import { scrollAreaStateAttributesMapping } from '../root/stateAttributes';

import type { ScrollAreaRoot } from '../root/ScrollAreaRoot';

/**
 * The actual scrollable container of the scroll area.
 * Renders a `<div>` element.
 */
export function ScrollAreaViewport(componentProps: ScrollAreaViewport.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { scrollArea, viewportState } = useScrollAreaRootContext();

    return useRenderElement('div', componentProps, {
        ref: [ref, scrollArea.setViewport],
        state: viewportState,
        props: [toReactProps(scrollArea.getViewportProps()), elementProps],
        customStyleHookMapping: scrollAreaStateAttributesMapping
    });
}

export type ScrollAreaViewportProps = {} & HeadlessUIComponentProps<'div', ScrollAreaViewport.State>;

export type ScrollAreaViewportState = {} & ScrollAreaRoot.State;

export namespace ScrollAreaViewport {
    export type Props = ScrollAreaViewportProps;
    export type State = ScrollAreaViewportState;
}
