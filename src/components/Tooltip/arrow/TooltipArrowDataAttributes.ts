import { CommonPopupDataAttributes } from '~@lib/popupStateMapping';

export enum TooltipArrowDataAttributes {
    open = CommonPopupDataAttributes.open,
    closed = CommonPopupDataAttributes.closed,
    anchorHidden = CommonPopupDataAttributes.anchorHidden,
    side = 'data-side',
    align = 'data-align',
    uncentered = 'data-uncentered'
}
