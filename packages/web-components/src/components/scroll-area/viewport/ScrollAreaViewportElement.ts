import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { ScrollAreaPart } from '../root/ScrollAreaRootContext';

/**
 * The scrolling container: it holds the content and is scrolled.
 */
export class ScrollAreaViewportElement extends ScrollAreaPart.withAttributes({}) {
    protected override onTargetChange(element: HTMLElement | null) {
        this.scrollArea?.setViewport(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.scrollArea.getViewportProps(), this.stateAttributes);
    }
}
