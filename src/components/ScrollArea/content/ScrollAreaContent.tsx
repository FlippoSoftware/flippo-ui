import React from 'react';

import { useIsoLayoutEffect } from '@flippo-ui/hooks/use-iso-layout-effect';

import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useScrollAreaRootContext } from '../root/ScrollAreaRootContext';
import { scrollAreaStateAttributesMapping } from '../root/stateAttributes';
import { useScrollAreaViewportContext } from '../viewport/ScrollAreaViewportContext';

import type { ScrollAreaRoot } from '../root/ScrollAreaRoot';

/**
 * A container for the content of the scroll area.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Scroll Area](https://base-ui.com/react/components/scroll-area)
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

    const contentWrapperRef = React.useRef<HTMLDivElement | null>(null);

    const { computeThumbPosition } = useScrollAreaViewportContext();
    const { viewportState } = useScrollAreaRootContext();

    useIsoLayoutEffect(() => {
        if (typeof ResizeObserver === 'undefined') {
            return undefined;
        }

        const ro = new ResizeObserver(computeThumbPosition);

        if (contentWrapperRef.current) {
            ro.observe(contentWrapperRef.current);
        }

        return () => {
            ro.disconnect();
        };
    }, [computeThumbPosition]);

    const element = useRenderElement('div', componentProps, {
        ref: [ref, contentWrapperRef],
        state: viewportState,
        customStyleHookMapping: scrollAreaStateAttributesMapping,
        props: [{
            role: 'presentation',
            style: {
                minWidth: 'fit-content'
            }
        }, elementProps]
    });

    return element;
}

export namespace ScrollAreaContent {
    export type State = ScrollAreaRoot.State;
    export type Props = HeadlessUIComponentProps<'div', ScrollAreaContent.State>;
}
