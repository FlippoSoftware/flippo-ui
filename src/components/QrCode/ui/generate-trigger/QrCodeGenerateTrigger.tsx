import React from 'react';

import { QrCode as QrCodeHeadless } from '@flippo-ui/headless-components/qr-code';

export function QrCodeGenerateTrigger(props: QrCodeGenerateTrigger.Props) {
    return <QrCodeHeadless.GenerateTrigger {...props} />;
}

export namespace QrCodeGenerateTrigger {
    export type Props = QrCodeHeadless.GenerateTrigger.Props;
}
