import type { CustomStyleHookMapping } from '@lib/getStyleHookProps';

import type { TabsTab } from '../tab/TabsTab';

import { TabsRootDataAttributes } from './TabsRootDataAttributes';

import type { TabsRoot } from './TabsRoot';

export const tabsStyleHookMapping: CustomStyleHookMapping<TabsRoot.State> = {
    tabActivationDirection: (dir: TabsTab.ActivationDirection) => ({
        [TabsRootDataAttributes.activationDirection]: dir
    })
};
