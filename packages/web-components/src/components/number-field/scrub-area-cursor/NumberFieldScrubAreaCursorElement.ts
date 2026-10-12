import { NumberFieldMachine } from '@flippo-software/core-components/number-field';
import { mergeProps } from '@flippo-software/core-components/props';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { prepareTopLayer, releaseTopLayer, showInTopLayer } from '../../../lib/topLayer';
import { NUMBER_FIELD_SCRUB_AREA } from '../root/NumberFieldRootContext';

abstract class NumberFieldScrubAreaPart extends ContextPart<typeof NUMBER_FIELD_SCRUB_AREA> {
    protected readonly contexts = NUMBER_FIELD_SCRUB_AREA;
}

/**
 * A cursor shown, in the top layer, while scrubbing (the real cursor is hidden by the pointer lock).
 */
export class NumberFieldScrubAreaCursorElement extends NumberFieldScrubAreaPart.withAttributes({}) {
    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        const scrubArea = this.provided[1].machine;
        return effect(() => {
            const shown = scrubArea.shouldRenderCursor();
            untracked(() => {
                const { target } = this;
                if (target) {
                    showInTopLayer(target, shown);
                }
            });
        });
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.provided[1]?.machine.setCursor(element);
        if (element) {
            prepareTopLayer(element);
        }
    }

    protected override onTargetRelease(element: HTMLElement) {
        releaseTopLayer(element);
    }

    protected override getProps(): Props {
        const scrubArea = this.provided[1].machine;
        return mergeProps(
            scrubArea.getCursorProps(),
            { hidden: !scrubArea.shouldRenderCursor() },
            NumberFieldMachine.attrs(this.provided[0].machine.getState())
        );
    }
}
