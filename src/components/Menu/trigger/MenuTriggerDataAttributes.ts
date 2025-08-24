import { CommonTriggerDataAttributes } from '@lib/popupStateMapping';

export enum MenuTriggerDataAttributes {
    /**
     * Present when the corresponding menu is open.
     */
    popupOpen = CommonTriggerDataAttributes.popupOpen,
    /**
     * Present when the trigger is pressed.
     */
    pressed = CommonTriggerDataAttributes.pressed
}
