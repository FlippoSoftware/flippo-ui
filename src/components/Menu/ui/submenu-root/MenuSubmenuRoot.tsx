import React from 'react';

import { Menu as MenuHeadless } from '@flippo-ui/headless-components/menu';

export function MenuSubmenuRoot(props: MenuSubmenuRoot.Props) {
    return <MenuHeadless.SubmenuRoot {...props} />;
}

export namespace MenuSubmenuRoot {
    export type Props = MenuHeadless.SubmenuRoot.Props;
}
