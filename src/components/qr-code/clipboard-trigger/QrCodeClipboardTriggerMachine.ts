import { Store, untracked } from '@flippo-software/store';

import { ButtonMachine } from '~@components/button/root/ButtonMachine';
import { OptionsStore } from '~@lib/OptionsStore';
import { mergeProps } from '~@props/mergeProps';

import type { Props } from '~@props/mergeProps';

import type { QrCodeFileExtension, QrCodeMachine, QrCodeRenderer } from '../root/QrCodeMachine';
import type { TriggerBaseOptions } from '../utils/TriggerBaseOptions';

export type QrCodeClipboardTriggerOptions = TriggerBaseOptions & {
    /**
     * @default 'svg'
     */
    extension?: QrCodeFileExtension | undefined;
    /**
     * @default 'blob'
     */
    copyAs?: 'blob' | 'dataUrl' | undefined;
    onCopy?: (() => void) | undefined;
    onCopyError?: ((error: unknown) => void) | undefined;
};

/**
 * Button that copies the generated QR code to the clipboard.
 */
export class QrCodeClipboardTriggerMachine<Renderer extends QrCodeRenderer = QrCodeRenderer> {
    readonly button = new ButtonMachine();

    readonly store = new Store({ copying: false });

    /**
     * The options, in a store: computed values and effects reading them follow their changes, key by key.
     */
    private readonly optionsStore = new OptionsStore<QrCodeClipboardTriggerOptions>({} as QrCodeClipboardTriggerOptions);

    private get options(): QrCodeClipboardTriggerOptions {
        return this.optionsStore.state;
    }

    private set options(options: QrCodeClipboardTriggerOptions) {
        this.optionsStore.setState(options);
    }

    private readonly qrCode: QrCodeMachine<Renderer>;

    constructor(qrCode: QrCodeMachine<Renderer>, options: QrCodeClipboardTriggerOptions = {}) {
        this.qrCode = qrCode;
        this.options = options;
        this.syncButton();
    }

    setOptions(options: QrCodeClipboardTriggerOptions) {
        // What the machine reads while applying its options is not a dependency of the caller (e.g. an effect).
        untracked(() => {
            this.options = options;
            this.syncButton();
        });
    }

    get disabled() {
        return Boolean(!this.qrCode.renderer || this.options.disabled || this.store.state.copying);
    }

    getState() {
        return { ...this.qrCode.getState(), disabled: this.disabled, copying: this.store.state.copying };
    }

    getProps(elementProps: Props = {}): Props {
        this.syncButton();
        return this.button.getButtonProps(mergeProps({ onClick: this.copy }, elementProps));
    }

    private readonly copy = async () => {
        const renderer = this.qrCode.renderer;
        if (!renderer || this.store.state.copying) {
            return;
        }

        const { extension = 'svg', copyAs = 'blob', onCopy, onCopyError } = this.options;
        this.store.set('copying', true);
        this.syncButton();

        try {
            const data = await renderer.getRawData(extension);
            if (!data) {
                throw new Error('Failed to get QR code data');
            }

            const blob =
                data instanceof Blob
                    ? data
                    : new Blob([new Uint8Array(data as ArrayBuffer)], {
                          type: extension === 'svg' ? 'image/svg+xml' : `image/${extension}`
                      });

            if (copyAs === 'dataUrl') {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                const dataUrl = await new Promise<string>((resolve, reject) => {
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                });
                await navigator.clipboard.writeText(dataUrl);
            } else if (extension === 'svg') {
                await navigator.clipboard.writeText(await blob.text());
            } else {
                await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
            }

            onCopy?.();
        } catch (error) {
            onCopyError?.(error);
        } finally {
            this.store.set('copying', false);
            this.syncButton();
        }
    };

    private syncButton() {
        this.button.setOptions({ disabled: this.disabled, native: this.options.nativeButton });
    }
}
