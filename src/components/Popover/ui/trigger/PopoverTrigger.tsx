import React from 'react';

import { Popover as PopoverHeadless } from '@flippo-ui/headless-components/popover';

export function PopoverTrigger(props: PopoverTrigger.Props) {
    return <PopoverHeadless.Trigger {...props} />;
}

export namespace PopoverTrigger {
    export type Props = PopoverHeadless.Trigger.Props;
}
