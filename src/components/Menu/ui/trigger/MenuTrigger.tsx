import React from 'react';

import { Menu as MenuHeadless } from '@flippo-ui/headless-components/menu';

export function MenuTrigger(props: MenuTrigger.Props) {
    return <MenuHeadless.Trigger {...props} />;
}

export namespace MenuTrigger {
    export type Props = MenuHeadless.Trigger.Props;
}
