import React from 'react';

import { Slot as SlotHeadless } from '@flippo-ui/headless-components/slot';

export function Slot(props: Slot.Props) {
    return <SlotHeadless {...props} />;
}

export namespace Slot {
    export type Props = React.ComponentProps<typeof SlotHeadless>;
}
