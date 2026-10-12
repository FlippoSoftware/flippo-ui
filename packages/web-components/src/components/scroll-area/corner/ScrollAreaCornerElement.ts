import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { ScrollAreaPart } from '../root/ScrollAreaRootContext';

/**
 * The corner between the two scrollbars, hidden unless both are shown.
 */
export class ScrollAreaCornerElement extends ScrollAreaPart.withAttributes({}) {
    protected override onTargetChange(element: HTMLElement | null) {
        this.scrollArea?.setCorner(element);
    }

    protected override getProps(): Props {
        return mergeProps(
            this.scrollArea.getCornerProps(),
            this.stateAttributes,
            this.scrollArea.shouldRenderCorner() ? {} : { hidden: true }
        );
    }
}
