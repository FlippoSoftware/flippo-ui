import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { ScrollAreaPart } from '../root/ScrollAreaRootContext';

/**
 * The content of the viewport (its size is measured).
 */
export class ScrollAreaContentElement extends ScrollAreaPart.withAttributes({}) {
    protected override onTargetChange(element: HTMLElement | null) {
        this.scrollArea?.setContent(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.scrollArea.getContentProps(), this.stateAttributes);
    }
}
