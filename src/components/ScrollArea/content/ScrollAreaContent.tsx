import { toReactProps } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useScrollAreaRootContext } from '../root/ScrollAreaRootContext';
import { scrollAreaStateAttributesMapping } from '../root/stateAttributes';

import type { ScrollAreaRoot } from '../root/ScrollAreaRoot';

/**
 * A container for the content of the scroll area.
 * Renders a `<div>` element.
 */
export function ScrollAreaContent(componentProps: ScrollAreaContent.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { scrollArea, viewportState } = useScrollAreaRootContext();

    return useRenderElement('div', componentProps, {
        // The machine recomputes the thumbs when the content resizes.
        ref: [ref, scrollArea.setContent],
        state: viewportState,
        customStyleHookMapping: scrollAreaStateAttributesMapping,
        props: [toReactProps(scrollArea.getContentProps()), elementProps]
    });
}

export namespace ScrollAreaContent {
    export type State = ScrollAreaRoot.State;
    export type Props = HeadlessUIComponentProps<'div', ScrollAreaContent.State>;
}
