import React from 'react';

import { Dialog as DialogHeadless } from '@flippo-ui/headless-components/dialog';

export function DialogRoot(props: DialogRoot.Props) {
    return <DialogHeadless.Root {...props} />;
}

export namespace DialogRoot {
    export type Props = DialogHeadless.Root.Props;
}
