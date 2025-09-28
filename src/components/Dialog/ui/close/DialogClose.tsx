import React from 'react';

import { Dialog as DialogHeadless } from '@flippo-ui/headless-components/dialog';

export function DialogClose(props: DialogClose.Props) {
    return <DialogHeadless.Close {...props} />;
}

export namespace DialogClose {
    export type Props = DialogHeadless.Close.Props;
}
