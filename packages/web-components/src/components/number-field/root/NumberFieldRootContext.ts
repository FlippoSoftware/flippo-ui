import { NumberFieldButtonMachine, NumberFieldMachine } from '@flippo-software/core-components/number-field';
import { mergeProps } from '@flippo-software/core-components/props';

import type { NumberFieldChangeEventDetails, NumberFieldCommitEventDetails } from '@flippo-software/core-components/number-field';
import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext } from '../../../lib/context';

import type { NumberFieldScrubAreaElement } from '../scrub-area/NumberFieldScrubAreaElement';

import type { NumberFieldElement } from './NumberFieldElement';

export type NumberFieldValueChangeDetail = {
    value: number | null;
    reason: NumberFieldChangeEventDetails['reason'];
};

export type NumberFieldValueCommittedDetail = {
    value: number | null;
    reason: NumberFieldCommitEventDetails['reason'];
};

export const NumberFieldContext = createContext<NumberFieldElement>('number-field');

export const NumberFieldScrubAreaContext = createContext<NumberFieldScrubAreaElement>('number-field-scrub-area');

const NUMBER_FIELD_ROOT = [NumberFieldContext] as const;

export abstract class NumberFieldPart extends ContextPart<typeof NUMBER_FIELD_ROOT> {
    protected readonly contexts = NUMBER_FIELD_ROOT;

    protected get numberField(): NumberFieldMachine {
        return this.provided[0].machine;
    }

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected get stateAttributes(): Props {
        return NumberFieldMachine.attrs(this.numberField.getState());
    }
}

/**
 * Base of the buttons that step the value; holding them repeats.
 */
export abstract class NumberFieldButtonPart extends NumberFieldPart.withAttributes({
    disabled: 'boolean'
}) {
    private stepper!: NumberFieldButtonMachine;

    protected abstract readonly increment: boolean;

    protected override createParts() {
        this.stepper = new NumberFieldButtonMachine(this.numberField, this.increment, this.getOptions());
    }

    protected override applyOptions() {
        this.stepper.setOptions(this.getOptions());
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.stepper?.button.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.stepper.getProps(), NumberFieldMachine.attrs(this.stepper.getState()));
    }

    private getOptions() {
        return { disabled: this.disabled ?? false, nativeButton: this.target?.localName === 'button' };
    }
}

export const NUMBER_FIELD_SCRUB_AREA = [NumberFieldContext, NumberFieldScrubAreaContext] as const;
