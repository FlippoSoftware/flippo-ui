import { mergeProps } from '@flippo-software/core-components/props';
import { ScrollAreaMachine } from '@flippo-software/core-components/scroll-area';

import type { Props } from '@flippo-software/core-components/props';
import type { ScrollAreaOrientation } from '@flippo-software/core-components/scroll-area';

import { declareProvider, provideContext } from '../../../lib/context';
import { ScrollAreaPart, ScrollAreaScrollbarContext } from '../root/ScrollAreaRootContext';

/**
 * A scrollbar, hidden while there is nothing to scroll in its orientation (unless `keep-mounted`).
 *
 * Attributes: `orientation` (`vertical` by default, `horizontal`), `keep-mounted`.
 * State attributes: also `data-orientation`, `data-hovering`.
 */
export class ScrollAreaScrollbarElement extends ScrollAreaPart.withAttributes({
    orientation: ['vertical', 'horizontal'],
    'keep-mounted': 'boolean'
}) {
    constructor() {
        super();
        declareProvider(this, ScrollAreaScrollbarContext);
    }

    get scrollbarOrientation(): ScrollAreaOrientation {
        return this.orientation ?? 'vertical';
    }

    protected override connectParts() {
        return provideContext(this, ScrollAreaScrollbarContext, this);
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.scrollArea?.setScrollbar(this.scrollbarOrientation, element);
    }

    protected override getProps(): Props {
        const orientation = this.scrollbarOrientation;
        const rendered = this.scrollArea.shouldRenderScrollbar(orientation, this.keepMounted ?? false);
        return mergeProps(
            this.scrollArea.getScrollbarProps(orientation),
            ScrollAreaMachine.attrs(this.scrollArea.getScrollbarState(orientation)),
            rendered ? {} : { hidden: true }
        );
    }
}
