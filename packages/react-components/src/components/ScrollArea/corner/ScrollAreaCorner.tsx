import { toReactProps } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useScrollAreaRootContext } from '../root/ScrollAreaRootContext';

/**
 * A small rectangular area that appears at the intersection of horizontal and vertical scrollbars.
 * Renders a `<div>` element.
 */
export function ScrollAreaCorner(componentProps: ScrollAreaCorner.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { scrollArea } = useScrollAreaRootContext();

    const element = useRenderElement('div', componentProps, {
        ref: [ref, scrollArea.setCorner],
        props: [toReactProps(scrollArea.getCornerProps()), elementProps]
    });

    if (!scrollArea.shouldRenderCorner()) {
        return null;
    }

    return element;
}

export namespace ScrollAreaCorner {
    export type State = {};
    export type Props = HeadlessUIComponentProps<'div', ScrollAreaCorner.State>;
}
