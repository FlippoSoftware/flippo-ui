import React from 'react';

import { Dialog as DialogHeadless } from '@flippo-ui/headless-components/dialog';

export function DialogTrigger(props: DialogTrigger.Props) {
    return <DialogHeadless.Trigger {...props} />;
}

export namespace DialogTrigger {
    export type Props = DialogHeadless.Trigger.Props;
}
