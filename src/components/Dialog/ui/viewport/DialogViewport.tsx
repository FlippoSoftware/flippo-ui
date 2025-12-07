import React from 'react';

import { Dialog as DialogHeadless } from '@flippo-ui/headless-components/dialog';

export function DialogViewport(props: DialogViewport.Props) {
    return <DialogHeadless.Viewport {...props} />;
}

export namespace DialogViewport {
    export type Props = DialogHeadless.Title.Props;
}
