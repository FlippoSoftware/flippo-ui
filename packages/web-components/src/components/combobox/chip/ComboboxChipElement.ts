import { ComboboxChipMachine } from '@flippo-software/core-components/combobox';
import { Store } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { declareProvider, provideContext } from '../../../lib/context';
import { COMBOBOX_CHIPS, ComboboxChipContext } from '../root/ComboboxRootContext';

abstract class ComboboxChipsPart extends ContextPart<typeof COMBOBOX_CHIPS> {
    protected readonly contexts = COMBOBOX_CHIPS;
}

/**
 * A chosen value of a `multiple` combobox. Its `value` property is the value (set by the chips' template rendering).
 */
export class ComboboxChipElement extends ComboboxChipsPart.withAttributes({}) {
    private chip!: ComboboxChipMachine;

    private readonly valueStore = new Store<{ value: unknown }>({ value: undefined });

    constructor() {
        super();
        declareProvider(this, ComboboxChipContext);
    }

    get machine(): ComboboxChipMachine {
        return this.chip;
    }

    /**
     * The value of the chip.
     */
    get value(): unknown {
        return this.valueStore.state.value;
    }

    set value(value: unknown) {
        this.valueStore.set('value', value);
    }

    protected override createParts() {
        this.chip = new ComboboxChipMachine(this.provided[0].machine, this.provided[1].machine);
    }

    protected override applyOptions() {}

    protected override connectParts() {
        const disconnect = this.chip.connect();
        const stopProviding = provideContext(this, ComboboxChipContext, this);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.chip?.setElement(element);
    }

    protected override getProps(): Props {
        return this.chip.getChipProps();
    }
}
