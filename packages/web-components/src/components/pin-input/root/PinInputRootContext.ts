import { PinInputMachine } from '@flippo-software/core-components/pin-input';

import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext } from '../../../lib/context';

import type { PinInputElement } from './PinInputElement';

export type PinInputValueChangeDetail = {
    value: string;
    values: string[];
};

export const PinInputContext = createContext<PinInputElement>('pin-input');

const PIN_INPUT_ROOT = [PinInputContext] as const;

export abstract class PinInputPart extends ContextPart<typeof PIN_INPUT_ROOT> {
    protected readonly contexts = PIN_INPUT_ROOT;

    protected get pinInput(): PinInputMachine {
        return this.provided[0].machine;
    }

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected get stateAttributes(): Props {
        return PinInputMachine.attrs(this.pinInput.getState());
    }
}
