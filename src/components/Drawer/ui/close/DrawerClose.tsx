import React from 'react';

import { Drawer as DrawerHeadless } from '@flippo-ui/headless-components/drawer';

export function DrawerClose(props: DrawerClose.Props) {
    return <DrawerHeadless.Close {...props} />;
}

export namespace DrawerClose {
    export type Props = DrawerHeadless.Close.Props;
}


