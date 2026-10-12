import type { MeterMachine } from '@flippo-software/core-components/meter';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext } from '../../../lib/context';

import type { MeterElement } from './MeterElement';

export const MeterContext = createContext<MeterElement>('meter');

const METER_ROOT = [MeterContext] as const;

export abstract class MeterPart extends ContextPart<typeof METER_ROOT> {
    protected readonly contexts = METER_ROOT;

    protected get meter(): MeterMachine {
        return this.provided[0].machine;
    }

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }
}
