import React from 'react';

import { QrCode as QrCodeHeadless } from '@flippo-ui/headless-components/qr-code';

export function QrCodeDownloadTrigger(props: QrCodeDownloadTrigger.Props) {
    return <QrCodeHeadless.DownloadTrigger {...props} />;
}

export namespace QrCodeDownloadTrigger {
    export type Props = QrCodeHeadless.DownloadTrigger.Props;
}
