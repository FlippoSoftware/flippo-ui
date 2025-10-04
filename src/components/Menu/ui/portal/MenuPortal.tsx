import React from 'react';

import { Menu as MenuHeadless } from '@flippo-ui/headless-components/menu';

export function MenuPortal(props: MenuPortal.Props) {
    return <MenuHeadless.Portal {...props} />;
}

export namespace MenuPortal {
    export type Props = MenuHeadless.Portal.Props;
}
