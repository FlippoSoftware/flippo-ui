import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useScrollAreaRootContext } from '../root/ScrollAreaRootContext';

/**
 * A small rectangular area that appears at the intersection of horizontal and vertical scrollbars.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Scroll Area](https://base-ui.com/react/components/scroll-area)
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

    const { cornerRef, cornerSize, hiddenState } = useScrollAreaRootContext();

    const element = useRenderElement('div', componentProps, {
        ref: [ref, cornerRef],
        props: [{
            style: {
                position: 'absolute',
                bottom: 0,
                insetInlineEnd: 0,
                width: cornerSize.width,
                height: cornerSize.height
            }
        }, elementProps]
    });

    if (hiddenState.cornerHidden) {
        return null;
    }

    return element;
}

export namespace ScrollAreaCorner {
    export type State = {};
    export type Props = HeadlessUIComponentProps<'div', ScrollAreaCorner.State>;
}
