import React from 'react';

import { Toast as ToastHeadless } from '@flippo-ui/headless-components/toast';

export function ToastProvider(props: ToastProvider.Props) {
    return <ToastHeadless.Provider {...props} />;
}

export namespace ToastProvider {
    export type Props = ToastHeadless.Provider.Props;
}
