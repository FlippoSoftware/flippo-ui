import { QrCodeOverlayDataAttributes, QrCodeRootDataAttributes } from '@flippo-software/core-components/qr-code';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';

import type { QrCodeOverlay } from '../overlay/QrCodeOverlay';
import type { QrCodeRoot } from '../root/QrCodeRoot';

export const qrCodeStyleHookMapping: StateAttributesMapping<QrCodeRoot.State> = {
    status: (status): Record<string, string> => {
        switch (status) {
            case 'idle':
                return { [QrCodeRootDataAttributes.statusIdle]: '' };
            case 'loading':
                return { [QrCodeRootDataAttributes.statusLoading]: '' };
            case 'error':
                return { [QrCodeRootDataAttributes.statusError]: '' };
            case 'generated':
                return { [QrCodeRootDataAttributes.statusGenerated]: '' };
        }
    }
};

export const qrCodeOverlayStyleHookMapping: StateAttributesMapping<QrCodeOverlay.State> = {
    ...qrCodeStyleHookMapping,
    transitionStatus: (transitionStatus): Record<string, string> | null => {
        switch (transitionStatus) {
            case 'starting':
                return { [QrCodeOverlayDataAttributes.startingStyle]: '' };
            case 'ending':
                return { [QrCodeOverlayDataAttributes.endingStyle]: '' };
            default:
                return null;
        }
    }
};
