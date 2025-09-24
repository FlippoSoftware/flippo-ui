import React from 'react';

import { Tooltip as TooltipHeadless } from '@flippo-ui/headless-components/tooltip';

export function TooltipProvider(props: TooltipProvider.Props) {
    return <TooltipHeadless.Provider {...props} />;
}

export namespace TooltipProvider {
    export type Props = TooltipHeadless.Provider.Props;
}
