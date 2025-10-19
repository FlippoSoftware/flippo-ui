import React from 'react';

import { QrCode as QrCodeHeadless } from '@flippo-ui/headless-components/qr-code';

export function QrCodeClipboardTrigger(props: QrCodeClipboardTrigger.Props) {
    return <QrCodeHeadless.ClipboardTrigger {...props} />;
}

export namespace QrCodeClipboardTrigger {
    export type Props = QrCodeHeadless.ClipboardTrigger.Props;
}
