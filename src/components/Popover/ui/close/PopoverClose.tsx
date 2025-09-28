import React from 'react';

import { Popover as PopoverHeadless } from '@flippo-ui/headless-components/popover';

export function PopoverClose(props: PopoverClose.Props) {
    return <PopoverHeadless.Close {...props} />;
}

export namespace PopoverClose {
    export type Props = PopoverHeadless.Close.Props;
}
