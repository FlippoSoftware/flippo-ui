import React from 'react';

import { PinInput as PinInputHeadless } from '@flippo-ui/headless-components/pin-input';

export function PinInputGroup(props: PinInputGroup.Props) {
    return <PinInputHeadless.Group {...props} />;
}

export namespace PinInputGroup {
    export type Props = PinInputHeadless.Group.Props;
}
