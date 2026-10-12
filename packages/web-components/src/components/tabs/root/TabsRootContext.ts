import type { TabsChangeEventDetails, TabsListMachine, TabsMachine } from '@flippo-software/core-components/tabs';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext } from '../../../lib/context';

import type { TabsListElement } from '../list/TabsListElement';

import type { TabsElement } from './TabsElement';

export type TabsValueChangeDetail = {
    value: unknown;
    reason: TabsChangeEventDetails['reason'];
    activationDirection: TabsChangeEventDetails['activationDirection'];
};

export const TabsContext = createContext<TabsElement>('tabs');

export const TabsListContext = createContext<TabsListElement>('tabs-list');

const TABS = [TabsContext] as const;

const TABS_AND_LIST = [TabsContext, TabsListContext] as const;

export abstract class TabsPart extends ContextPart<typeof TABS> {
    protected readonly contexts = TABS;

    protected get tabs(): TabsMachine {
        return this.provided[0].machine;
    }
}

export abstract class TabsListPart extends ContextPart<typeof TABS_AND_LIST> {
    protected readonly contexts = TABS_AND_LIST;

    protected get tabs(): TabsMachine {
        return this.provided[0].machine;
    }

    protected get list(): TabsListMachine {
        return this.provided[1].machine;
    }
}
