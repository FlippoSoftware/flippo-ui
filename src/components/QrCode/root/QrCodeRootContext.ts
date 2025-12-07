import React from 'react';

import type QRCodeStyling from 'qr-code-styling';

import type { QrCodeRoot } from './QrCodeRoot';

export type QrCodeRootContextValue = {
    value: string;
    size: {
        width: number;
        height: number;
    };
    error: unknown | undefined | null;
    status: QrCodeRoot.State['status'];
    qrCodeStyling: QRCodeStyling | null;
    generateQrCode: () => void;
};

export const QrCodeRootContext = React.createContext<QrCodeRootContextValue | undefined>(undefined);

export function useQrCodeRootContext() {
    const context = React.use(QrCodeRootContext);

    if (context === undefined) {
        throw new Error(
            'Headless UI: QrCodeRootContext is missing. QrCode parts must be placed within <QrCode.Root>.'
        );
    }

    return context;
}
