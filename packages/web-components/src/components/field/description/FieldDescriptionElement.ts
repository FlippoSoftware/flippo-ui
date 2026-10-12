import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { createId } from '../../../lib/createId';
import { FieldPart } from '../root/FieldRootContext';

/**
 * A text that describes the control (`aria-describedby` of the control).
 */
export class FieldDescriptionElement extends FieldPart.withAttributes({}) {
    private readonly generatedId = createId('field-description');

    protected override connectParts() {
        return this.labelable?.addMessageId(this.targetId(this.generatedId)) ?? (() => {});
    }

    protected override getProps(): Props {
        return mergeProps({ id: this.targetId(this.generatedId) }, this.fieldAttributes);
    }
}
