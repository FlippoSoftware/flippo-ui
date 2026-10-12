import { CommonPopupDataAttributes } from '~@lib/popupStateMapping';

import { MultipleActiveAttributes } from '../utils/stateAttributes';

export enum TooltipArrowDataAttributes {
    open = CommonPopupDataAttributes.open,
    closed = CommonPopupDataAttributes.closed,
    anchorHidden = CommonPopupDataAttributes.anchorHidden,
    side = 'data-side',
    align = 'data-align',
    uncentered = 'data-uncentered',
    multipleActive = MultipleActiveAttributes.multipleActive
}
