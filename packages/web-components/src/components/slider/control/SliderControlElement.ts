import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { SliderPart } from '../root/SliderRootContext';

/**
 * The area that responds to the pointer: a press moves the closest thumb there.
 */
export class SliderControlElement extends SliderPart.withAttributes({}) {
    protected override onTargetChange(element: HTMLElement | null) {
        this.slider?.setControlElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.slider.getControlProps(), this.stateAttributes);
    }
}
