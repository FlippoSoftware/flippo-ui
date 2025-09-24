import React from 'react';

import { Tooltip as TooltipHeadless } from '@flippo-ui/headless-components/tooltip';

export function TooltipRoot(props: TooltipRoot.Props) {
    return <TooltipHeadless.Root {...props} />;
}

export namespace TooltipRoot {
    export type Props = TooltipHeadless.Root.Props;
}
