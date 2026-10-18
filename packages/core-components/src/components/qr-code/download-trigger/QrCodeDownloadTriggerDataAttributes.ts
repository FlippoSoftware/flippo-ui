export enum QrCodeDownloadTriggerDataAttributes {
    /**
     * The value of the QR code.
     */
    value = 'data-value',
    /**
     * The status of the QR code generation.
     */
    statusIdle = 'data-status-idle',
    /**
     * The status of the QR code generation.
     */
    statusLoading = 'data-status-loading',
    /**
     * The status of the QR code generation.
     */
    statusError = 'data-status-error',
    /**
     * The status of the QR code generation.
     */
    statusGenerated = 'data-status-generated',
    /**
     * Whether the QR code is currently being downloaded.
     */
    downloading = 'data-downloading'
}
