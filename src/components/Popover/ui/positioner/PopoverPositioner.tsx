import React from 'react';

import { Popover as PopoverHeadless } from '@flippo-ui/headless-components/popover';

export function PopoverPositioner(props: PopoverPositioner.Props) {
    const { sideOffset = 8, ...otherProps } = props;

    return <PopoverHeadless.Positioner {...otherProps} sideOffset={sideOffset} />;
}

export namespace PopoverPositioner {
    export type Props = PopoverHeadless.Positioner.Props;
}
