import { QrCodeMachine } from '@flippo-software/core-components/qr-code';

import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext } from '../../../lib/context';

import type { QrCodeElement } from './QrCodeElement';

export const QrCodeContext = createContext<QrCodeElement>('qr-code');

const QR_CODE_ROOT = [QrCodeContext] as const;

export abstract class QrCodePart extends ContextPart<typeof QR_CODE_ROOT> {
    protected readonly contexts = QR_CODE_ROOT;

    protected get qrCode(): QrCodeMachine {
        return this.provided[0].machine;
    }

    protected get stateAttributes(): Props {
        return QrCodeMachine.attrs(this.qrCode.getState());
    }
}
