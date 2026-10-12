import { sva } from '@lynstack/class-recipe';

import { button } from '../button';

const ACTION = button({ variant: 'secondary', size: 'small' });

/** QR code: `root`, `frame`, `overlay`, the `actions` row and its `generateTrigger`, `clipboardTrigger`, `downloadTrigger`. */
export const qrCode = sva({
    slots: ['root', 'frame', 'overlay', 'actions', 'generateTrigger', 'clipboardTrigger', 'downloadTrigger'],
    base: {
        root: 'fl-qr-code-root',
        frame: 'fl-qr-code-frame',
        overlay: 'fl-qr-code-overlay',
        actions: 'fl-qr-code-actions',
        generateTrigger: ACTION,
        clipboardTrigger: ACTION,
        downloadTrigger: ACTION
    },
    variants: {}
});

/**
 * Rendering options of the styled QR code: an SVG drawn in `currentColor` (the frame's colour, so it follows the
 * theme) on a transparent background, with rounded modules.
 */
export const qrCodeOptions = {
    type: 'svg',
    backgroundOptions: { color: 'transparent' },
    dotsOptions: { color: 'currentColor', type: 'rounded' },
    cornersSquareOptions: { color: 'currentColor', type: 'extra-rounded' },
    cornersDotOptions: { color: 'currentColor', type: 'dot' }
} as const;
