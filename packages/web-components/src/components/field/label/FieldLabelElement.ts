import { getFieldLabelProps } from '@flippo-software/core-components/field';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { createId } from '../../../lib/createId';
import { FieldPart } from '../root/FieldRootContext';

/**
 * The label of the control of the field. Best on a `<label>` with `as-child`; as the element itself, a click on it
 * focuses (or clicks) the control.
 */
export class FieldLabelElement extends FieldPart.withAttributes({}) {
    private readonly generatedId = createId('field-label');

    protected override connectParts() {
        const { labelable } = this;
        if (!labelable) {
            return () => {};
        }
        labelable.setLabelId(this.targetId(this.generatedId));
        return () => labelable.setLabelId(undefined);
    }

    protected override getProps(target: HTMLElement): Props {
        const { labelable } = this;
        if (!labelable) {
            return {};
        }
        const props = mergeProps(getFieldLabelProps(labelable), this.fieldAttributes);
        if (target.localName === 'label') {
            return props;
        }
        // Not a native label: activate the control like one.
        return mergeProps(props, {
            onClick: (event: MouseEvent) => {
                const id = labelable.controlId;
                const root = target.getRootNode() as Document | ShadowRoot;
                const control = id ? root.getElementById(id) : null;
                if (!control || event.defaultPrevented || control.contains(event.target as Node)) {
                    return;
                }
                if (control.localName === 'input' || control.localName === 'textarea' || control.localName === 'select') {
                    control.focus();
                } else {
                    control.click();
                    control.focus();
                }
            }
        });
    }
}
