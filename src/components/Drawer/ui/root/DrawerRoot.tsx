import React from 'react';

import { Drawer as DrawerHeadless } from '@flippo-ui/headless-components/drawer';

export function DrawerRoot(props: DrawerRoot.Props) {
    return <DrawerHeadless.Root {...props} />;
}

export namespace DrawerRoot {
    export type Props = DrawerHeadless.Root.Props;
}
