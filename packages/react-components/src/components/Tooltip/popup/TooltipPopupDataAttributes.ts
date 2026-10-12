import { CommonPopupDataAttributes } from '~@lib/popupStateMapping';

import { MultipleActiveAttributes } from '../utils/stateAttributes';

export enum TooltipPopupDataAttributes {
    open = CommonPopupDataAttributes.open,
    closed = CommonPopupDataAttributes.closed,
    startingStyle = CommonPopupDataAttributes.startingStyle,
    endingStyle = CommonPopupDataAttributes.endingStyle,
    anchorHidden = CommonPopupDataAttributes.anchorHidden,
    multipleActive = MultipleActiveAttributes.multipleActive,
    side = 'data-side',
    align = 'data-align',
    instant = 'data-instant'
}
