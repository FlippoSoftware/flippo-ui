import React from 'react';

import { Tabs as TabsHeadless } from '@flippo-ui/headless-components/tabs';

export function TabsRoot(props: TabsRoot.Props) {
    return <TabsHeadless.Root {...props} />;
}

export namespace TabsRoot {
    export type Props = TabsHeadless.Root.Props;
}
