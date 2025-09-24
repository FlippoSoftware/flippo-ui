import React from 'react';

import { Tooltip as TooltipHeadless } from '@flippo-ui/headless-components/tooltip';

export function TooltipTrigger(props: TooltipTrigger.Props) {
    return <TooltipHeadless.Trigger {...props} />;
}

export namespace TooltipTrigger {
    export type Props = TooltipHeadless.Trigger.Props;
}
