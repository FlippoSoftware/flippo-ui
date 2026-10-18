import { LabelableController } from '@flippo-software/core-components/labelable';

import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { FieldItemContext, FieldPart, LabelableContext } from '../root/FieldRootContext';

/**
 * A group of controls in a field (e.g. a checkbox of a checkbox group), labelled on its own.
 *
 * Attributes: `disabled`.
 */
export class FieldItemElement extends FieldPart.withAttributes({
    /**
     * Whether the wrapped control should ignore user interaction.
     * The `disabled` attribute on `<prefix>-field` takes precedence over this.
     * @default false
     */
    disabled: 'boolean'
}) {
    private controller: LabelableController | null = null;

    constructor() {
        super();
        declareProvider(this, LabelableContext);
        declareProvider(this, FieldItemContext);
    }

    get labelable(): LabelableController {
        this.controller ??= new LabelableController(createId('field-item-control'), this.labelableProvider?.labelable ?? null);
        return this.controller;
    }

    /**
     * Whether the controls of the item are disabled (by the item or the field).
     */
    get itemDisabled(): boolean {
        return (this.disabled ?? false) || (this.field?.machine.disabled ?? false);
    }

    protected override connectParts() {
        const stopLabelable = provideContext(this, LabelableContext, this);
        const stopItem = provideContext(this, FieldItemContext, this);
        return () => {
            stopItem();
            stopLabelable();
        };
    }

    protected override getProps(): Props {
        return this.fieldAttributes;
    }
}
