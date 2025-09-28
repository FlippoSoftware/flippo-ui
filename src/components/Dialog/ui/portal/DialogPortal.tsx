import React from 'react';

import { Dialog as DialogHeadless } from '@flippo-ui/headless-components/dialog';

export function DialogPortal(props: DialogPortal.Props) {
    return <DialogHeadless.Portal {...props} />;
}

export namespace DialogPortal {
    export type Props = DialogHeadless.Portal.Props;
}
