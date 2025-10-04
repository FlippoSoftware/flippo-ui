import React from 'react';

import { Menu as MenuHeadless } from '@flippo-ui/headless-components/menu';
import { ChevronRightIcon } from '@flippo-ui/icons';

export function MenuSubmenuTrigger(props: MenuSubmenuTrigger.Props) {
    return <MenuHeadless.SubmenuTrigger {...props} />;
}

MenuSubmenuTrigger.Svg = ChevronRightIcon;

export namespace MenuSubmenuTrigger {
    export type Props = MenuHeadless.SubmenuTrigger.Props;
}
