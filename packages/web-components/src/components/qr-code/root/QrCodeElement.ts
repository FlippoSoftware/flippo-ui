import { QrCodeMachine } from '@flippo-software/core-components/qr-code';

import type { Props } from '@flippo-software/core-components/props';
import type { QrCodeGenerationOptions, QrCodeOptions, QrCodeRenderer } from '@flippo-software/core-components/qr-code';

import { declareProvider, provideContext } from '../../../lib/context';
import { MachineElement, property } from '../../../lib/MachineElement';

import { QrCodeContext } from './QrCodeRootContext';

/**
 * A QR code of a value: the root of the `-qr-code-*` parts. The drawing is done by a renderer you give (no
 * dependency is bundled), e.g. with `qr-code-styling`: `element.createRenderer = (options) => new QRCodeStyling(options)`.
 *
 * Attributes: `value`, `size` (px; 200), `generate-on-mount` (`"false"`: only a generate trigger draws it).
 * Properties: `createRenderer` (required), `options` (the renderer's options: colors, dots, image…).
 * Events: `generate` (`detail: { renderer }`), `generate-error` (`detail: { error }`).
 * State attributes: `data-status-idle`, `data-status-loading`, `data-status-generated`, `data-status-error`.
 * CSS variables: `--qr-code-width`, `--qr-code-height`.
 */
export class QrCodeElement extends MachineElement.withAttributes({
    /** The text or URL to encode in the QR code. */
    value: 'string',
    /**
     * The size (width and height) of the QR code in pixels.
     * @default 200
     */
    size: 'number',
    /**
     * Whether to generate the QR code on mount.
     * @default true
     */
    'generate-on-mount': 'boolean',
    /** Creates the renderer that draws the code from its options, e.g. `(options) => new QRCodeStyling(options)`. Required: no renderer is bundled. */
    createRenderer: property<QrCodeOptions['createRenderer']>(),
    /** Advanced styling and customization options. */
    options: property<QrCodeGenerationOptions>()
}) {
    private qrCode!: QrCodeMachine;

    constructor() {
        super();
        declareProvider(this, QrCodeContext);
    }

    get machine(): QrCodeMachine {
        return this.qrCode;
    }

    protected override createParts() {
        this.qrCode = new QrCodeMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.qrCode.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.qrCode.afterCommit();
    }

    protected override connectParts() {
        return provideContext(this, QrCodeContext, this);
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.qrCode?.setRootElement(element);
    }

    protected override getProps(): Props {
        return QrCodeMachine.attrs(this.qrCode.getState());
    }

    private getOptions(): QrCodeOptions {
        return {
            value: this.value ?? '',
            size: this.size ?? 200,
            options: this.options,
            generateOnMount: (this.generateOnMount ?? true) && this.createRenderer !== undefined,
            createRenderer: (options) => {
                if (!this.createRenderer) {
                    throw new Error('Flippo web components: set `createRenderer` on the QR code to draw it.');
                }
                return this.createRenderer(options);
            },
            onGenerate: (renderer: QrCodeRenderer) => {
                this.emit('generate', { renderer });
            },
            onError: (error: unknown) => {
                this.emit('generate-error', { error });
            }
        };
    }
}
