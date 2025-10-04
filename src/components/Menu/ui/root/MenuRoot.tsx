import React from 'react';

import { Menu as MenuHeadless } from '@flippo-ui/headless-components/menu';

export function MenuRoot(props: MenuRoot.Props) {
    return <MenuHeadless.Root {...props} />;
}

export namespace MenuRoot {
    export type Props = MenuHeadless.Root.Props;
}
