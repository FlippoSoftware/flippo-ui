import { FieldRootMachine } from '@flippo-software/core-components/field';

import type { FieldControlChangeEventDetails } from '@flippo-software/core-components/field';
import type { LabelableController } from '@flippo-software/core-components/labelable';
import type { Props } from '@flippo-software/core-components/props';

import { createContext, providesContext, requestAncestorContexts } from '../../../lib/context';
import { MachineElement } from '../../../lib/MachineElement';

import type { FieldItemElement } from '../item/FieldItemElement';

import type { FieldElement } from './FieldElement';

export type FieldValueChangeDetail = {
    value: string;
    reason: FieldControlChangeEventDetails['reason'];
};

/**
 * An element that labels the control in it: a field, or an item of a field.
 */
export type LabelableProvider = Element & {
    readonly labelable: LabelableController;
};

export const FieldContext = createContext<FieldElement>('field');

export const LabelableContext = createContext<LabelableProvider>('labelable');

export const FieldItemContext = createContext<FieldItemElement>('field-item');

/**
 * The optional contexts of a control: the field, the closest labelling element and the field item it is in.
 */
export const FIELD_CONTROL_CONTEXTS = [
    [FieldContext, providesContext(FieldContext)],
    // The field, or a field item.
    [LabelableContext, providesContext(LabelableContext)],
    [FieldItemContext, providesContext(FieldItemContext)]
] as const;

/**
 * Base of the parts of a field: they take the field and the labelling element around them, if any.
 */
export abstract class FieldPart extends MachineElement {
    protected field: FieldElement | undefined;

    protected labelableProvider: LabelableProvider | undefined;

    private cancelRequests: (() => void) | null = null;

    protected get labelable(): LabelableController | undefined {
        return this.labelableProvider?.labelable;
    }

    protected override whenReady(callback: () => void) {
        this.cancelRequests?.();
        this.cancelRequests = requestAncestorContexts(this, FIELD_CONTROL_CONTEXTS, ([field, labelable]) => {
            this.cancelRequests = null;
            this.field = field;
            this.labelableProvider = labelable;
            callback();
        });
    }

    override disconnectedCallback() {
        this.cancelRequests?.();
        this.cancelRequests = null;
        super.disconnectedCallback();
    }

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    /**
     * The state attributes of the field, if any.
     */
    protected get fieldAttributes(): Props {
        return this.field ? FieldRootMachine.attrs(this.field.machine.getState()) : {};
    }
}
