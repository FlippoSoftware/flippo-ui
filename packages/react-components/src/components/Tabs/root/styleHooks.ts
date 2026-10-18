import { TabsRootDataAttributes } from '@flippo-software/core-components/tabs';

import type { CustomStyleHookMapping } from '~@lib/getStyleHookProps';

import type { TabsTab } from '../tab/TabsTab';

import type { TabsRoot } from './TabsRoot';

export const tabsStyleHookMapping: CustomStyleHookMapping<TabsRoot.State> = {
    tabActivationDirection: (dir: TabsTab.ActivationDirection) => ({
        [TabsRootDataAttributes.activationDirection]: dir
    })
};
