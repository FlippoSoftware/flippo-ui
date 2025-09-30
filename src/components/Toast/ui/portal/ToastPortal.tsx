import React from 'react';

import { Toast as ToastHeadless } from '@flippo-ui/headless-components/toast';

export function ToastPortal(props: ToastPortal.Props) {
    return <ToastHeadless.Portal {...props} />;
}

export namespace ToastPortal {
    export type Props = ToastHeadless.Portal.Props;
}
