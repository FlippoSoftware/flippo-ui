import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { NumberFieldPart } from '../root/NumberFieldRootContext';

/**
 * The text input: put it on an `<input>` with `as-child`.
 */
export class NumberFieldInputElement extends NumberFieldPart.withAttributes({}) {
    protected override onTargetChange(element: HTMLElement | null) {
        this.numberField?.setInputElement(element as HTMLInputElement | null);
    }

    protected override getProps(): Props {
        return mergeProps(this.numberField.getInputProps(), this.stateAttributes);
    }
}
