import React from 'react';

import { Drawer as DrawerHeadless } from '@flippo-ui/headless-components/drawer';

export function DrawerTrigger(props: DrawerTrigger.Props) {
    return <DrawerHeadless.Trigger {...props} />;
}

export namespace DrawerTrigger {
    export type Props = DrawerHeadless.Trigger.Props;
}


