import React from 'react';

import { Popover as PopoverHeadless } from '@flippo-ui/headless-components/popover';

export function PopoverRoot(props: PopoverRoot.Props) {
    return <PopoverHeadless.Root {...props} />;
}

export namespace PopoverRoot {
    export type Props = PopoverHeadless.Root.Props;
}
