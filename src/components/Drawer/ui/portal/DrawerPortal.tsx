import React from 'react';

import { Drawer as DrawerHeadless } from '@flippo-ui/headless-components/drawer';

export function DrawerPortal(props: DrawerPortal.Props) {
    return <DrawerHeadless.Portal {...props} />;
}

export namespace DrawerPortal {
    export type Props = DrawerHeadless.Portal.Props;
}


