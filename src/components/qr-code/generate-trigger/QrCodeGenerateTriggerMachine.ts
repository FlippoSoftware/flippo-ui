import { untracked } from '@flippo-software/store';

import { ButtonMachine } from '~@components/button/root/ButtonMachine';
import { OptionsStore } from '~@lib/OptionsStore';
import { mergeProps } from '~@props/mergeProps';

import type { Props } from '~@props/mergeProps';

import type { QrCodeMachine, QrCodeRenderer } from '../root/QrCodeMachine';
import type { TriggerBaseOptions } from '../utils/TriggerBaseOptions';

/**
 * Button that generates the QR code on demand.
 */
export class QrCodeGenerateTriggerMachine<Renderer extends QrCodeRenderer = QrCodeRenderer> {
    readonly button = new ButtonMachine();

    /**
     * The options, in a store: computed values and effects reading them follow their changes, key by key.
     */
    private readonly optionsStore = new OptionsStore<TriggerBaseOptions>({} as TriggerBaseOptions);

    private get options(): TriggerBaseOptions {
        return this.optionsStore.state;
    }

    private set options(options: TriggerBaseOptions) {
        this.optionsStore.setState(options);
    }

    private readonly qrCode: QrCodeMachine<Renderer>;

    constructor(qrCode: QrCodeMachine<Renderer>, options: TriggerBaseOptions = {}) {
        this.qrCode = qrCode;
        this.options = options;
        this.syncButton();
    }

    setOptions(options: TriggerBaseOptions) {
        // What the machine reads while applying its options is not a dependency of the caller (e.g. an effect).
        untracked(() => {
            this.options = options;
            this.syncButton();
        });
    }

    get disabled() {
        const status = this.qrCode.store.state.status;
        return Boolean(status === 'loading' || this.qrCode.renderer || this.options.disabled);
    }

    getState() {
        return { status: this.qrCode.store.state.status, disabled: this.disabled };
    }

    getProps(elementProps: Props = {}): Props {
        this.syncButton();
        return this.button.getButtonProps(mergeProps({ onClick: this.qrCode.generate }, elementProps));
    }

    private syncButton() {
        this.button.setOptions({ disabled: this.disabled, native: this.options.nativeButton });
    }
}
