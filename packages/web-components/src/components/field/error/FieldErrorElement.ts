import { mergeProps } from '@flippo-software/core-components/props';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { createId } from '../../../lib/createId';
import { FallbackText } from '../../../lib/FallbackText';
import { FieldPart } from '../root/FieldRootContext';

/**
 * The error of the field, shown while it is invalid. Without content of its own, it shows the validation messages
 * (several as a `<ul part="list">`).
 *
 * Attributes: `match` (show only for a given validity flag, e.g. `valueMissing`; `true`: always).
 */
export class FieldErrorElement extends FieldPart.withAttributes({
    /**
     * Determines whether to show the error message according to the field’s
     * [ValidityState](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState).
     * Specifying `true` will always show the error message, and lets external libraries
     * control the visibility.
     */
    match: 'string'
}) {
    private readonly generatedId = createId('field-error');

    private readonly text = new FallbackText(this);

    protected override connectParts() {
        return effect(() => {
            if (this.isRendered()) {
                return untracked(() => this.labelable?.addMessageId(this.targetId(this.generatedId)));
            }
            return;
        });
    }

    protected override getProps(): Props {
        const rendered = this.isRendered();
        const messages = rendered ? (this.field?.machine.getErrorMessages() ?? '') : '';
        if (Array.isArray(messages)) {
            this.text.setList(messages);
        } else {
            this.text.set(messages);
        }
        return mergeProps({ id: this.targetId(this.generatedId), hidden: !rendered }, this.fieldAttributes);
    }

    private isRendered(): boolean {
        const { match } = this;
        return this.field?.machine.isErrorRendered(match === 'true' ? true : (match as keyof ValidityState | undefined)) ?? false;
    }
}
