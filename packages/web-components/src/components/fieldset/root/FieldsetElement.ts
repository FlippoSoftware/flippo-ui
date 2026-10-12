import { FieldsetMachine } from '@flippo-software/core-components/fieldset';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { MachineElement } from '../../../lib/MachineElement';

import { FieldsetContext } from './FieldsetRootContext';

/**
 * A group of fields, labelled by its legend; `disabled` disables the fields in it. Use it as the element itself, or
 * on a `<fieldset>` with `as-child`.
 *
 * Attributes: `disabled`.
 * State attributes: `data-disabled`.
 */
export class FieldsetElement extends MachineElement.withAttributes({
    disabled: 'boolean'
}) {
    private fieldset!: FieldsetMachine;

    constructor() {
        super();
        declareProvider(this, FieldsetContext);
    }

    get machine(): FieldsetMachine {
        return this.fieldset;
    }

    protected override createParts() {
        this.fieldset = new FieldsetMachine({ disabled: this.disabled ?? false });
    }

    protected override applyOptions() {
        this.fieldset.setOptions({ disabled: this.disabled ?? false });
    }

    protected override connectParts() {
        return provideContext(this, FieldsetContext, this);
    }

    protected override getProps(target: HTMLElement): Props {
        return mergeProps(this.fieldset.getRootProps(), target.localName === 'fieldset' ? {} : { role: 'group' });
    }
}
