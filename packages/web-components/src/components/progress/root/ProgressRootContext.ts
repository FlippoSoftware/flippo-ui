import { ProgressMachine } from '@flippo-software/core-components/progress';

import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext } from '../../../lib/context';

import type { ProgressElement } from './ProgressElement';

export const ProgressContext = createContext<ProgressElement>('progress');

const PROGRESS_ROOT = [ProgressContext] as const;

export abstract class ProgressPart extends ContextPart<typeof PROGRESS_ROOT> {
    protected readonly contexts = PROGRESS_ROOT;

    protected get progress(): ProgressMachine {
        return this.provided[0].machine;
    }

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected get stateAttributes(): Props {
        return ProgressMachine.attrs(this.progress.getState());
    }
}
