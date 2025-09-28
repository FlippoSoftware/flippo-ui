import React from 'react';

import { Popover as PopoverHeadless } from '@flippo-ui/headless-components/popover';

export function PopoverPortal(props: PopoverPortal.Props) {
    return <PopoverHeadless.Portal {...props} />;
}

export namespace PopoverPortal {
    export type Props = PopoverHeadless.Portal.Props;
}
