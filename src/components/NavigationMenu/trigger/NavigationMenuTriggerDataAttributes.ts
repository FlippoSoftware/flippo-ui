import { CommonTriggerDataAttributes } from '~@lib/popupStateMapping';

export enum NavigationMenuTriggerDataAttributes {
    /**
     * Present when the corresponding navigation menu is open.
     */
    popupOpen = CommonTriggerDataAttributes.popupOpen,
    /**
     * Present when the trigger is pressed.
     */
    pressed = CommonTriggerDataAttributes.pressed
}
