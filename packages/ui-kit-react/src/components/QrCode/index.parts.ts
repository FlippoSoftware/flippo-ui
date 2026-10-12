'use client';
import { qrCodeOptions, qrCode as recipe } from '@flippo-software/component-styles/qr-code';
import { QrCode as Primitive } from '@flippo-software/react-components/qr-code';

import { createStyler } from '../../lib/Styled';

import type { RecipeVariants, StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'qrCode');
export type Variants = RecipeVariants<typeof recipe>;
export const ClipboardTrigger: StyledComponent<typeof Primitive.ClipboardTrigger, typeof recipe> = styled(
    Primitive.ClipboardTrigger,
    'clipboardTrigger',
    false
);
export const DownloadTrigger: StyledComponent<typeof Primitive.DownloadTrigger, typeof recipe> = styled(
    Primitive.DownloadTrigger,
    'downloadTrigger',
    false
);
export const Frame: StyledComponent<typeof Primitive.Frame, typeof recipe> = styled(Primitive.Frame, 'frame', false);
export const GenerateTrigger: StyledComponent<typeof Primitive.GenerateTrigger, typeof recipe> = styled(
    Primitive.GenerateTrigger,
    'generateTrigger',
    false
);
export const Overlay: StyledComponent<typeof Primitive.Overlay, typeof recipe> = styled(Primitive.Overlay, 'overlay', false);
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true, {
    defaults: { options: qrCodeOptions }
});
export const Actions: StyledComponent<'div', typeof recipe> = styled('div', 'actions');
