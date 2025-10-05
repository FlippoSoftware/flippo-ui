import { CommonPopupDataAttributes } from '~@lib/popupStateMapping';

export enum TooltipArrowDataAttributes {
    open = CommonPopupDataAttributes.open,
    closed = CommonPopupDataAttributes.closed,
    startingStyle = CommonPopupDataAttributes.startingStyle,
    endingStyle = CommonPopupDataAttributes.endingStyle,
    anchorHidden = CommonPopupDataAttributes.anchorHidden,
    side = 'data-side',
    align = 'data-align',
    instant = 'data-instant'
}
