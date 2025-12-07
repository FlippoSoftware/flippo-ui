import type { QrCodeRoot } from '../root/QrCodeRoot';

/**
 * Predefined QR code style presets for common use cases
 */
export const QrCodePresets = {
    /**
     * Classic black and white QR code
     */
    classic: (): QrCodeRoot.QrCodeGenerationOptions => ({
        dotsOptions: {
            color: '#000000',
            type: 'square'
        },
        backgroundOptions: {
            color: '#ffffff'
        },
        cornersSquareOptions: {
            color: '#000000',
            type: 'square'
        },
        cornersDotOptions: {
            color: '#000000',
            type: 'square'
        }
    }),

    /**
     * Modern rounded style with subtle colors
     */
    modern: (): QrCodeRoot.QrCodeGenerationOptions => ({
        dotsOptions: {
            color: '#1f2937',
            type: 'rounded'
        },
        backgroundOptions: {
            color: '#f8fafc'
        },
        cornersSquareOptions: {
            color: '#374151',
            type: 'extra-rounded'
        },
        cornersDotOptions: {
            color: '#374151',
            type: 'dot'
        },
        margin: 20
    }),

    /**
     * Colorful gradient style
     */
    gradient: (): QrCodeRoot.QrCodeGenerationOptions => ({
        dotsOptions: {
            gradient: {
                type: 'linear',
                rotation: 45,
                colorStops: [{ offset: 0, color: '#667eea' }, { offset: 1, color: '#764ba2' }]
            },
            type: 'rounded'
        },
        backgroundOptions: {
            color: '#ffffff'
        },
        cornersSquareOptions: {
            gradient: {
                type: 'radial',
                colorStops: [{ offset: 0, color: '#f093fb' }, { offset: 1, color: '#f5576c' }]
            },
            type: 'extra-rounded'
        },
        cornersDotOptions: {
            color: '#f5576c',
            type: 'dot'
        },
        margin: 15
    }),

    /**
     * Dots pattern for a unique look
     */
    dots: (): QrCodeRoot.QrCodeGenerationOptions => ({
        dotsOptions: {
            color: '#2563eb',
            type: 'dots'
        },
        backgroundOptions: {
            color: '#f1f5f9'
        },
        cornersSquareOptions: {
            color: '#1d4ed8',
            type: 'dot'
        },
        cornersDotOptions: {
            color: '#1d4ed8',
            type: 'dot'
        },
        margin: 25
    }),

    /**
     * High contrast for better readability
     */
    highContrast: (): QrCodeRoot.QrCodeGenerationOptions => ({
        dotsOptions: {
            color: '#000000',
            type: 'classy'
        },
        backgroundOptions: {
            color: '#ffffff'
        },
        cornersSquareOptions: {
            color: '#000000',
            type: 'square'
        },
        cornersDotOptions: {
            color: '#000000',
            type: 'square'
        },
        margin: 10,
        qrOptions: {
            errorCorrectionLevel: 'H' // High error correction for better scanning
        }
    }),

    /**
     * Elegant style with soft corners
     */
    elegant: (): QrCodeRoot.QrCodeGenerationOptions => ({
        dotsOptions: {
            color: '#6366f1',
            type: 'classy-rounded'
        },
        backgroundOptions: {
            gradient: {
                type: 'linear',
                rotation: 135,
                colorStops: [{ offset: 0, color: '#ffffff' }, { offset: 1, color: '#f8fafc' }]
            }
        },
        cornersSquareOptions: {
            color: '#4f46e5',
            type: 'extra-rounded'
        },
        cornersDotOptions: {
            color: '#4f46e5',
            type: 'dot'
        },
        margin: 30
    }),

    /**
     * Brand-friendly style with customizable colors
     */
    brand: (primaryColor = '#3b82f6', secondaryColor = '#1e40af'): QrCodeRoot.QrCodeGenerationOptions => ({
        dotsOptions: {
            color: primaryColor,
            type: 'rounded'
        },
        backgroundOptions: {
            color: '#ffffff'
        },
        cornersSquareOptions: {
            color: secondaryColor,
            type: 'extra-rounded'
        },
        cornersDotOptions: {
            color: secondaryColor,
            type: 'dot'
        },
        margin: 20
    })
} as const;

/**
 * Create a custom QR code style with logo support
 */
export function createQrCodeWithLogo(
    logoUrl: string,
    baseStyle: QrCodeRoot.QrCodeGenerationOptions = QrCodePresets.modern()
): QrCodeRoot.QrCodeGenerationOptions {
    return {
        ...baseStyle,
        image: logoUrl,
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.3,
            margin: 10,
            crossOrigin: 'anonymous',
            ...baseStyle.imageOptions
        }
    };
}

/**
 * Utility to merge multiple QR code option objects
 */
export function mergeQrCodeOptions(
    ...options: Array<Partial<QrCodeRoot.QrCodeGenerationOptions>>
): QrCodeRoot.QrCodeGenerationOptions {
    return options.reduce((merged, current) => {
        return {
            ...merged,
            ...current,
            dotsOptions: {
                ...merged.dotsOptions,
                ...current.dotsOptions
            },
            backgroundOptions: {
                ...merged.backgroundOptions,
                ...current.backgroundOptions
            },
            cornersSquareOptions: {
                ...merged.cornersSquareOptions,
                ...current.cornersSquareOptions
            },
            cornersDotOptions: {
                ...merged.cornersDotOptions,
                ...current.cornersDotOptions
            },
            imageOptions: {
                ...merged.imageOptions,
                ...current.imageOptions
            },
            qrOptions: {
                ...merged.qrOptions,
                ...current.qrOptions
            }
        };
    }, {} as QrCodeRoot.QrCodeGenerationOptions);
}
