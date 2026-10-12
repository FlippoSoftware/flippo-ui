import { SliderMachine } from '@flippo-software/core-components/slider';

import type { Props } from '@flippo-software/core-components/props';
import type { SliderChangeEventDetails, SliderCommitEventDetails, SliderValue } from '@flippo-software/core-components/slider';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext } from '../../../lib/context';

import type { SliderElement } from './SliderElement';

export type SliderValueChangeDetail = {
    value: number | number[];
    reason: SliderChangeEventDetails['reason'];
    activeThumbIndex: number;
};

export type SliderValueCommittedDetail = {
    value: SliderValue;
    reason: SliderCommitEventDetails['reason'];
};

export const SliderContext = createContext<SliderElement>('slider');

export const SLIDER_WHITESPACE = /\s+/;

const SLIDER = [SliderContext] as const;

export abstract class SliderPart extends ContextPart<typeof SLIDER> {
    protected readonly contexts = SLIDER;

    protected get rootElement(): SliderElement {
        return this.provided[0];
    }

    protected get slider(): SliderMachine {
        return this.provided[0].machine;
    }

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected get stateAttributes(): Props {
        return SliderMachine.attrs(this.slider.getState());
    }
}
