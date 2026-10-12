import { CommonTriggerDataAttributes } from '~@lib/popupStateMapping';

export enum SelectTriggerDataAttributes {
    /**
     * Present when the corresponding select is open.
     */
    popupOpen = CommonTriggerDataAttributes.popupOpen,
    /**
     * Present when the trigger is pressed.
     */
    pressed = CommonTriggerDataAttributes.pressed,
    /**
     * Present when the select is disabled.
     */
    disabled = 'data-disabled',
    /**
     * Present when the select is readonly.
     */
    readonly = 'data-readonly',
    /**
     * Present when the select is required.
     */
    required = 'data-required'
}
