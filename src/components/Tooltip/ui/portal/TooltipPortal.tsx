import React from 'react';

import { Tooltip as TooltipHeadless } from '@flippo-ui/headless-components/tooltip';

export function TooltipPortal(props: TooltipPortal.Props) {
    return <TooltipHeadless.Portal {...props} />;
}

export namespace TooltipPortal {
    export type Props = TooltipHeadless.Portal.Props;
}
