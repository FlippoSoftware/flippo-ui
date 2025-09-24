import React from 'react';

import { Tooltip as TooltipHeadless } from '@flippo-ui/headless-components/tooltip';

export function TooltipPositioner(props: TooltipPositioner.Props) {
    const {
        sideOffset = 10,
        ...otherProps
    } = props;

    return <TooltipHeadless.Positioner {...otherProps} sideOffset={sideOffset} />;
}

export namespace TooltipPositioner {
    export type Props = TooltipHeadless.Positioner.Props;
}
