import { mergeProps } from '@flippo-software/core-components/props';
import { ScrollAreaMachine } from '@flippo-software/core-components/scroll-area';

import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { SCROLL_AREA_SCROLLBAR } from '../root/ScrollAreaRootContext';

abstract class ScrollAreaScrollbarPart extends ContextPart<typeof SCROLL_AREA_SCROLLBAR> {
    protected readonly contexts = SCROLL_AREA_SCROLLBAR;
}

/**
 * The thumb of a scrollbar: its size and position follow the scroll.
 */
export class ScrollAreaThumbElement extends ScrollAreaScrollbarPart.withAttributes({}) {
    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.provided?.[0].machine.setThumb(this.provided[1].scrollbarOrientation, element);
    }

    protected override getProps(): Props {
        const scrollArea = this.provided[0].machine;
        const orientation = this.provided[1].scrollbarOrientation;
        return mergeProps(scrollArea.getThumbProps(orientation), ScrollAreaMachine.attrs(scrollArea.getScrollbarState(orientation)));
    }
}
