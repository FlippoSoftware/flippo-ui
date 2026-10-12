import { ScrollAreaMachine } from '@flippo-software/core-components/scroll-area';

import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext } from '../../../lib/context';

import type { ScrollAreaScrollbarElement } from '../scrollbar/ScrollAreaScrollbarElement';

import type { ScrollAreaElement } from './ScrollAreaElement';

export const ScrollAreaContext = createContext<ScrollAreaElement>('scroll-area');

export const ScrollAreaScrollbarContext = createContext<ScrollAreaScrollbarElement>('scroll-area-scrollbar');

const SCROLL_AREA_ROOT = [ScrollAreaContext] as const;

export const SCROLL_AREA_SCROLLBAR = [ScrollAreaContext, ScrollAreaScrollbarContext] as const;

export abstract class ScrollAreaPart extends ContextPart<typeof SCROLL_AREA_ROOT> {
    protected readonly contexts = SCROLL_AREA_ROOT;

    protected get scrollArea(): ScrollAreaMachine {
        return this.provided[0].machine;
    }

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected get stateAttributes(): Props {
        return ScrollAreaMachine.attrs(this.scrollArea.getState());
    }
}
